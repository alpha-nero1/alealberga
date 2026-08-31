---
title: "Stuck in the mud: Should I use Flutter or React Native?"
excerpt: "When it comes to building mobile apps, this is generally the main thing that must be decided, here are the ins and outs of React vs Flutter"
pubDate: 2026-09-01
draft: false
---

Every mobile project eventually hits the same fork in the road: React Native or Flutter? I've written apps in both, and while the honest answer is always "it depends", I have started leaning one way more often than not. Here's the full picture, how they actually work, where each one wins, and how I make the call.

<figure>
  <img src="/blog/which-one.gif" alt="Which one?" width="400" />
  <figcaption>But which one will it be?</figcaption>
</figure>


## The Fundamentals - How Flutter vs React Native work under the hood

This is the part that gets glossed over, but it's important to know.

React Native renders your UI by driving **real** native components (`UIView` on iOS, `android.view.View` on Android) from JavaScript. 

Your app logic runs on a JS thread, and every interaction, a gesture, a layout change or an animation frame, has to hop across the JS harbour bridge (or, in the new architecture, harbour JSI) to talk to the native side (iOS or Android). That bridge is fast, but it's not **free**, and it's a queue, not a pipe. Push enough work through it at once, a heavy list scroll during a network response, say, and frames get dropped. That's the infamous <a href="https://reactnative.dev/docs/0.77/performance" target="_blank" rel="noreferrer">jank</a>!

Flutter takes a completely different approach: it doesn't use native UI components at all. It ships its own bespoke rendering engine (Impeller, previously Skia) and draws every pixel itself, directly onto a canvas that the OS makes available to it. Your Dart code compiles ahead-of-time to **native ARM/x64 machine code**, there's no bridge, no JS thread, no interpreter in the hot path. Flutter owns the entire frame pipeline from your widget tree down to the pixels on screen.

You can see the different philosophies in something as simple as a button. In React Native, JSX describes a tree that gets reconciled down to real native views:

```jsx
function LikeButton({ liked, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{liked ? '♥ Liked' : '♡ Like'}</Text>
    </Pressable>
  );
}
```

Flutter's widget tree looks similar on the surface, but every widget here is painted by Flutter itself, there's no underlying `UIButton` or `android.widget.Button`:

```dart
class LikeButton extends StatelessWidget {
  const LikeButton({super.key, required this.liked, required this.onPressed});

  final bool liked;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      child: Text(liked ? '♥ Liked' : '♡ Like'),
    );
  }
}
```

**Same result on screen, completely different path to get there.**

## The strengths and weaknesses of Flutter and React Native

### Flutter
**Strengths** start with animation. Because it isn't waiting on a bridge and isn't at the mercy of a JS thread that might be busy with some other thing, its animations stay silky smooth even when the rest of the app is under fire. Impeller pre-compiles shaders ahead of time rather than the first time an animation runs, which puts the classic "shader jank" to bed. You also get one legitimate pixel-perfect codebase across iOS and Android, since Flutter paints every pixel itself rather than deferring to two different native rendering systems that behave slightly differently.

**Weaknesses** however, are mostly about ecosystem and reach. Dart has a far smaller talent pool and package ecosystem than JavaScript. Because Flutter doesn't use native components, getting platform-default behaviour (system pickers, native scroll physics, OS-level text handling) sometimes takes extra work rather than coming for free. And you're asking your devs to learn a new language, which is a real cost that must be considered.

### React Native
**Strengths** are the flip side of that. It taps directly into the enormous JavaScript/TypeScript ecosystem, and the npm package library is vast and mostly usable as-is. Because it renders actual native components, platform-default UI tends to just work without extra effort. And if you've already got a web team fluent in React (which often can be the case), they can ship mobile without learning a new language at all, a real velocity win!

**Weaknesses** come back to that bridge. React Native *can* get silky smooth animation, and frameworks like <a href="https://docs.swmansion.com/react-native-reanimated/" target="_blank" rel="noreferrer">Reanimated</a> help to move animation work off the JS thread specifically to dodge the bridge bottleneck, but that's a workaround for an architectural constraint, not the default. You're also relying on third-party native modules for a lot of deeper platform functionality, and their quality and maintenance can vary a lot more than Flutter's own **first-party widget catalogue**.

<figure>
  <img src="/blog/itcrowd-jump.gif" alt="Your frames when the JS bridge is under the pump" width="600" />
  <figcaption>Your frames when the JS bridge is under the pump</figcaption>
</figure>

## Common examples of when to use either

Reach for **Flutter** when:
- The product lives or dies on custom, highly animated, pixel-perfect UI, onboarding flows, gesture-heavy interactions, anything that needs to *feel* premium
- You want one codebase that looks and behaves identically on both platforms, not "close enough"
- Raw animation performance (60fps minimum, ideally 120Hz) is a hard requirement, not a nice-to-have
- You're a smaller team that wants the least platform-specific fuss to maintain

Reach for **React Native** when:
- Your team already knows React and there's no time or appetite to pick up Dart
- You're sharing meaningful business logic or components with an existing React web app
- You want native look-and-feel out of the box without rebuilding platform conventions yourself
- You lean heavily on a specific piece of the npm ecosystem that doesn't have a mature Flutter equivalent

## But Ale, you forgot about JSX!

<figure>
  <img src="/blog/forgot.gif" alt="I Forgot" width="400" />
</figure>

That's true, I have!

One core reservation that most people will have when it comes to moving to Flutter (well I did anyway...) is that it doesn't come with the same elegant JSX (or something similar) that React Native does.
People love JSX, there's a reason it's so popular, having some resemblance to HTML in a React web app is great because you can visualise right away what you are producing when all is
said and done and the virtual DOM has been materialised.

However, I have two counter arguments for this when it comes to JSX for mobile apps, and that is:

### 1. JSX is really mimicking HTML
This makes sense for React, but for React Native, does it? Flutter's widget tree is actually a closer representation of how mobile widgets are composed and fit together.

Don't just take my word for it though, here's the proof. This is the same little profile card, built in Flutter and in **SwiftUI**, Apple's own native declarative UI framework for iOS:

```dart
class ProfileCard extends StatelessWidget {
  const ProfileCard({super.key, required this.name, required this.subtitle});

  final String name;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const CircleAvatar(radius: 24, backgroundImage: AssetImage('avatar.png')),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
              Text(subtitle, style: const TextStyle(color: Colors.grey)),
            ],
          ),
        ],
      ),
    );
  }
}
```

```swift
struct ProfileCard: View {
    let name: String
    let subtitle: String

    var body: some View {
        HStack {
            Image("avatar")
                .resizable()
                .frame(width: 48, height: 48)
                .clipShape(Circle())

            VStack(alignment: .leading) {
                Text(name).bold()
                Text(subtitle).foregroundColor(.gray)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }
}
```

Let's look at the shape of these two. A `Row` and a `HStack` doing the exact same job, a `Column` and a `VStack` doing the exact same job, styling applied as **properties** and **modifiers** rather than anything resembling a stylesheet. This isn't a coincidence, Flutter's widget composition model and SwiftUI's view composition model are solving the same problem the same way, because that's genuinely how native mobile UI wants to be described. JSX describing a `<div>` tree is solving a web problem, and for me, I always prefer the abstraction that is closer to the real thing.

### 2. Obvious bloat
In Flutter, it is obvious if your widget has become over bloated and should be split into several files, in React Native, not so much. Because Flutter requires opening and closing brackets for each widget (each widget is a class construction at the end of the day), this forces developers to maintain more succinct files lest you end up with something illegible.

On top of this you get really nice auto formatting for Flutter in IDEs like VSCode that auto sort your mess when developing. So when it comes to JSX, for web development I will always prefer React over Flutter in this regard because I (like many people) love the semblance to real HTML, whereas I think Flutter represents the mobile abstraction better and thus, I don't miss using JSX for mobile.

## How I decide when to use what

If the product's success depends on custom, highly animated, pixel-perfect UI, I reach for Flutter, without fail.

The direct-to-machine-code compilation and the fact that Flutter owns its own rendering pipeline end to end means I'm not fighting the framework to get animations that don't drop a frame. I'm currently leading mobile development on an app built around exactly this, world-class animations at a snappy 120Hz, and Flutter is the only framework I've used that hits that target as the default, not the exception.

If the team is a force of nature in React already, or the app is mostly standard native-feeling screens with heavy code-sharing needs against an existing React codebase, React Native is a perfectly good, often better choice.

But if you're asking me which I like more, with no other context: Flutter wins, mostly because of the animation pitch. No bridge to congest, no JS thread to starve, just your app compiled straight to machine code driving its own renderer. That's a hard architecture to beat when a smooth 120Hz experience is the bar.

<figure>
  <img src="/blog/impressive.gif" alt="Impressive" width="400" />
</figure>
---
title: "Flutter vs React Native"
excerpt: "When it comes to building mobile apps, this is generally the main thing that must be decided, here are the ins and outs of react vs flutter"
pubDate: 2026-08-11
---

Every mobile project eventually hits the same fork in the road: React Native or Flutter?
I've shipped production apps in both, and while the honest answer is "it depends,"
my default has settled firmly on Flutter. Here's why, and where I'd still reach for
React Native instead.

## How they actually work

This is the part that gets glossed over, but it's the whole story.

React Native renders your UI by driving real native components (`UIView` on iOS,
`android.view.View` on Android) from JavaScript. Your app logic runs on a JS thread,
and every interaction — a gesture, a layout change, an animation frame — has to hop
across a bridge (or, in the new architecture, JSI) to talk to the native side. That
bridge is fast, but it's not free, and it's a queue, not a pipe. Push enough work
through it at once — a heavy list scroll during a network response, say — and frames
get dropped. That's jank.

Flutter takes a completely different approach: it doesn't use native UI components at
all. It ships its own rendering engine (Skia, or Impeller on newer versions) and draws
every pixel itself, directly onto a canvas the OS hands it. Your Dart code compiles
ahead-of-time to native ARM/x64 machine code — there's no bridge, no JS thread, no
interpreter in the hot path. Flutter owns the entire frame pipeline from your widget
tree down to the pixels on screen.

You can see the difference in philosophy in something as simple as a button. In React
Native, JSX describes a tree that gets reconciled down to real native views:

```jsx
function LikeButton({ liked, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{liked ? '♥ Liked' : '♡ Like'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  label: { fontSize: 16, fontWeight: '600' },
});
```

Flutter's widget tree looks similar on the surface, but every widget here is painted
by Flutter itself — there's no underlying `UIButton` or `android.widget.Button`:

```dart
class LikeButton extends StatelessWidget {
  const LikeButton({super.key, required this.liked, required this.onPressed});

  final bool liked;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      child: Text(
        liked ? '♥ Liked' : '♡ Like',
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      ),
    );
  }
}
```

Same result on screen, completely different path to get there.

## Why that difference matters in practice

For most CRUD-shaped screens — forms, lists, navigation — you genuinely won't notice
the difference. Both frameworks are good enough. Where it becomes obvious is
animation: custom transitions, gesture-driven interactions, anything that needs to
hold a rock-solid 60 (or 120) fps while also doing real work.

Because Flutter isn't waiting on a bridge and isn't at the mercy of a JS thread that
might be busy with something else, its animations stay buttery even when the rest of
the app is under load. React Native *can* get there — Reanimated moves animation work
off the JS thread specifically to dodge this problem — but that's a workaround for an
architectural constraint, not the default. With Flutter, smooth is the default.

Take a simple "press and scale" animation. In React Native with Reanimated, you
explicitly opt the animation onto the UI thread with a shared value and a worklet:

```jsx
function ScaleOnPress({ children }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
```

In Flutter, the equivalent is just how animations work by default — no separate
thread to opt into, because there's no JS thread to escape in the first place:

```dart
class ScaleOnPress extends StatefulWidget {
  const ScaleOnPress({super.key, required this.child});
  final Widget child;

  @override
  State<ScaleOnPress> createState() => _ScaleOnPressState();
}

class _ScaleOnPressState extends State<ScaleOnPress> {
  double _scale = 1;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _scale = 0.9),
      onTapUp: (_) => setState(() => _scale = 1),
      child: AnimatedScale(
        scale: _scale,
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeOut,
        child: widget.child,
      ),
    );
  }
}
```

Both end up smooth, but notice the asymmetry: RN needed a library (Reanimated) and an
explicit mental model shift ("run this on the UI thread") to get there. Flutter's
`AnimatedScale` just does it, because there's no bridge to route around.

## Where React Native still wins

I don't think Flutter is the right call every time, and it's worth being honest about
where React Native has the edge:

- **Your team already knows React.** If you've got a web team fluent in
  React/TypeScript, React Native lets them ship mobile without learning Dart. That's
  a real velocity win, not a small one.
- **You're sharing code with a React web app.** Business logic, state management, even
  some components can realistically be shared between a React web app and React
  Native. Flutter can't touch your web React codebase.
- **You want native look-and-feel for free.** Because RN renders actual native
  components, platform-default UI (system pickers, native scroll physics, OS-level
  text handling) tends to just work without extra effort.
- **The npm ecosystem.** It's enormous, and a lot of it is usable as-is.

## How I actually decide

If the product lives or dies on custom, highly animated, pixel-perfect UI —
onboarding flows, gesture-heavy interactions, anything that needs to *feel* premium —
I reach for Flutter, every time. The direct-to-machine-code compilation and the fact
that Flutter owns its own rendering pipeline end to end means I'm not fighting the
framework to get animations that don't drop a frame.

If the team is React-native (pun intended) to the web, or the app is mostly standard
native-feeling screens with heavy code-sharing needs against an existing React
codebase, React Native is a perfectly good, often faster-to-ship choice.

But if you're asking me for a default with no other context: Flutter wins, mostly
because of that animation story. No bridge to congest, no JS thread to starve, just
your app compiled straight to machine code driving its own renderer. That's a hard
architecture to beat when jank is the enemy.

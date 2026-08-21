---
title: "Flutter and Firebase, the magical pair"
excerpt: "Do you have an idea you want to prove, a great product that isn't overly complex that you want to get to market quickly? this is how I ship product with Flutter & Firebase and why it is better than some might think"
pubDate: 2026-08-11
---

Ever had an idea in the shower or on the bus and wanted to give it a red hot crack? In these scenarios I opt for Flutter and Firebase every time, and here's why:

## Remove the need to be a backend engineer
Working on complex backend systems is great, and necessary when the situation calls for it, however, most simple apps really just need a basic CRUD backend with *maybe* some custom API processing.

This can easily be acheived using Firebase's Firestore (a no sql database that is incredibly easy to work with) mixed in with Firebase Functions; serverless APIs you can deploy using a variety of languages (like JS, python e.t.c.) although I usually opt for python for ease of integration with AI agents.

It's not only these 2 features that make Firebase such a potent tool in a developers arsenal, firebase can help devs with:
- Use Firebase auth to get authentication and even SSO working with minimal setup.
- Use Firestore for a fast and easy to use database for your app.
- Use Firestore functions for any custom functionality your app needs
- Use Firestore Database Triggers for running background processes after data is saved
- You can even set up a traditional pub/sub in firebase to decouple your workloads from the user!

All of these features come out of the box and allow you to focus almost soley on the brilliance of your app instead of getting bogged down in backend work, fast tracking your deployment to production.

## Case Study - FluentSRS



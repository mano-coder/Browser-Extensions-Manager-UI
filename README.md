# Frontend Mentor - Browser Extensions Manager UI

This is a solution to the [Browser extensions manager UI challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/browser-extensions-manager-ui-Z99S9pShM6).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Key Features](#key-features)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size.
- See hover and focus states for all interactive elements.
- Toggle extensions between **Active** and **Inactive** states.
- Filter extensions by their status (All, Active, Inactive).
- Remove extensions from the list.
- **Bonus**: Switch between light and dark modes with persistent memory.
- **Bonus**: State persistence using `localStorage`.

### Screenshot

![Design preview](./design/desktop-preview.jpg)

### Links

- Solution URL: [Your GitHub Repo URL]
- Live Site URL: [Your GitHub Pages URL]

## My process

### Built with

- Semantic HTML5 markup
- CSS Custom Properties (Variables)
- Flexbox & CSS Grid (Auto-fill/MinMax logic)
- Vanilla JavaScript (ES6+)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for data persistence.

### What I learned

This project was a great way to practice **State Management** in vanilla JavaScript without a framework. I focused on:

1. **Skeleton Loading Screens**: Improving Perceived Performance by showing a pulsing "shimmer" effect while data is being fetched.
2. **Event Delegation**: Handling clicks for dynamically generated "Remove" buttons and "Toggle" switches efficiently.
3. **Smooth Theme Transitions**: Using CSS transitions on variables to create a high-end feel when switching between light and dark modes.
4. **Accessible UI**: Ensuring that custom checkboxes have proper `aria-labels` and focus indicators for keyboard users.

```javascript
// Example: Using LocalStorage to persist user data
allExtensions = JSON.parse(localStorage.getItem("extensions")) || defaultData;
```

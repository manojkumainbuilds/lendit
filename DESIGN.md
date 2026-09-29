# LendIt Design System

## Product principle

LendIt is a lending workspace. The UI should help an operator understand context, make a decision, take an action, and see the result.

## Tokens

- Primary: `#4338CA` / `#4F46E5`
- Background: `#F6F7FB`
- Surface: `#FFFFFF`
- Border: `#E5E7EB`
- Heading: `#111827`
- Muted text: `#6B7280`
- Semantic: success / warning / danger / info
- Spacing: 4px base with 8px rhythm where practical
- Radius: 6 / 10 / 14px

## Component rule

Prefer semantic, reusable components. Screen-specific composition belongs in the feature layer.

## State rule

Major data views explicitly account for loading, success, empty, and error states.

## Accessibility baseline

- Native buttons and inputs
- Visible keyboard focus
- Labels on interactive inputs
- Status is communicated with text plus color
- Responsive navigation on small screens

## Theme

The app defaults to light mode and supports dark mode through the same semantic tokens.

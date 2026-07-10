# Version 2 design notes

## Design direction

The page keeps the centered academic hierarchy associated with ManipTrans-style project pages:

1. title / authors / resource buttons
2. overview figure
3. abstract and contributions
4. visual demo results
5. method / data curation figure
6. dataset coverage
7. benchmark and metrics
8. quantitative results
9. citation

For HandEdit, the page adds benchmark-specific elements that a method-only template lacks:

- paired human-to-robot demo theater
- Hand-only / Hand-Arm filtering
- data coverage panel
- real metric leaderboard
- best / second-best highlighting
- failure-mode visualization
- evaluation-stack explanation

## Demo UX

Each demo is one bordered rectangle split into two equal halves:

- left: source egocentric human video
- right: retargeted dexterous robot or robot hand-arm video
- center: direction arrow

On mobile, the two halves stack vertically while remaining one card.

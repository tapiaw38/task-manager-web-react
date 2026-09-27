# Performance

The gateway returns the complete task collection. Virtualization keeps DOM size bounded even when the collection grows.

`TaskList` uses `@tanstack/react-virtual` with a fixed row estimate and overscan. Only visible rows and a small buffer reach the DOM.

The list does not use pagination or search because the task contract returns all tasks and the challenge explicitly requires virtual scroll.

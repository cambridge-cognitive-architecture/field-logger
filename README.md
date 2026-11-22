# field-logger

A tablet app for shadowing studies that use wearable sensors. An observer logs, on one clock, where a participant is, what they are doing, when they are interrupted and how they rate it.

![Field logger with the made-up demo floor plan](docs/demo.png)

- **Set-up:** consent with signatures on the tablet, a checklist and a participant inventory.
- **Sync:** a flashing clock to show to the scene camera, and 5-dot accuracy tests.
- **Live map:** tap doors and open boundaries as they are crossed. Rooms, leaving the mapped areas and corrections are logged separately.
- **Tasks, interruptions and notes:** Undo marks an entry void and never erases it.
- **Ratings:** three sets, due after set minutes of natural work with a minimum gap, plus final ratings with one per area.
- **Walk-through:** a fixed route with timed pauses, forward or reverse.
- **Geometry editor:** draw areas, doors and open boundaries on your own floor plan.
- **Export:** JSON and CSV, with consent records saved apart from session files.

## Run it

There is no build and there are no dependencies. Serve the folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>, enter `DEMO01`, a role, a starting area, a camera exposure and the time the shift started, then tap Start session.

Offline use needs HTTPS or localhost for the first load.

## Adapt it

Everything study-specific is in [config.js](config.js): areas, route, roles, tasks, timings, questions, consent wording and checklist. All of it is made up. The consent text is **not** an approved form.

Raise the cache number in [sw.js](sw.js) after a change. Check the configuration with `node --test tests/*.mjs` (Node 20 or newer).

## Data care

Nothing is sent over the network. Sessions **and consent records with names and signatures** sit unencrypted in the browser's storage. Use a managed, locked device, export after each session, keep consent files apart from the data, and remove records from the tablet once they are safely stored.

While a session runs, the header shows the participant's first name if consent was signed on the tablet.

## Credit and licence

Developed by the Cambridge Cognitive Architecture Lab. The app descends from the lab's Analogue Mission Observation Mapper:

> Wang, A., Aguilar, L., & Gath-Morad, M. (2026). *Analogue Mission Observation Mapper (CCA)* [Software]. Cambridge Cognitive Architecture, University of Cambridge.

MIT, see [LICENSE](LICENSE).

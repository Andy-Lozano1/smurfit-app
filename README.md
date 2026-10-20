# Lectura de Entorno

### A community-centered dashboard for understanding the recovery needs of local businesses

**Lectura de Entorno** is a responsive, Spanish-language web prototype that helps organize community reports about informal businesses affected by an emergency. It turns sample reports into a clear operational view of business needs, follow-up status, and neighborhood distribution.

> **Portfolio prototype — not an official Smurfit Westrock product.** The business records and figures included in the app are illustrative demo data, not verified information or official statistics.

## Why this project

In a recovery effort, useful decisions start with making local needs visible. This prototype explores how a lightweight, accessible interface can help a team capture reports, follow their review status, and connect community context with public information sources.

## Product highlights

- **At-a-glance dashboard:** reported businesses, people linked to those businesses, estimated needs in COP, and verification status.
- **Business directory:** search and filter reports by status; create and edit records according to the demo role.
- **Role-based interface:** administrator, analyst, and read-only experiences.
- **Impact indicators:** summaries by neighborhood and reported type of damage.
- **CSV export:** download the currently filtered business records for further analysis.
- **Public data discovery:** search the Datos Abiertos Colombia catalog and browse links to official institutional sources.
- **Responsive Spanish UI:** designed for desktop and mobile, with accessible labels and keyboard focus states.
- **Browser persistence:** demo records are saved in `localStorage`; the demo session uses `sessionStorage`.

## Run locally

No build step, package manager, or dependency installation is required. Serve the project over HTTP from its root directory:

```powershell
python -m http.server 8000
```

Open **http://localhost:8000** in your browser. You can also use the VS Code Live Server extension.

> If `python` is not available on Windows, try `py -m http.server 8000`.

## Demo access

| Role | Username | Permissions in the prototype |
| --- | --- | --- |
| Administrator | `admin` | View, create, edit, and delete reports |
| Analyst | `analista` | View, create, and edit reports |
| Reader | `consulta` | Read-only access |

The password for all three demo accounts is **`smurfit2026`**.

These credentials are hard-coded for demonstration only. This app has no server-side authentication or authorization and must not be used to protect real accounts or sensitive data.

## Technology

- HTML5
- CSS3, including responsive layouts and CSS custom properties
- Vanilla JavaScript (ES6+)
- Browser Web Storage (`localStorage` and `sessionStorage`)
- Fetch API for the public Datos Abiertos Colombia catalog

## Project structure

```text
.
├── App.js                # Rendering, demo behavior, data handling, and interactions
├── index.html            # Spanish-language entry point
├── style.css             # Design system, components, and responsive styles
└── .vscode/
    └── launch.json       # VS Code browser launch configuration
```

## Data and responsible use

- The bundled businesses are fictional examples used to demonstrate the interface.
- Metrics are calculated from entered reports; they are not verified counts of affected people, official statistics, or aid allocations.
- Business data is stored only in the current browser profile. It is not shared across users or devices, and clearing browser storage removes it.
- The catalog search requires an internet connection. External portals are provided as references; users should check each source's freshness, coverage, and methodology.
- Do not enter personal or sensitive information. This prototype is not a production case-management system.

## Production considerations

Before using a system like this in a real recovery program, it would need, at minimum, secure server-side authentication and role enforcement, a shared and backed-up database, validated data collection and consent processes, auditability, and a privacy and security review.

## License

No license has been added yet. Ask the repository owner before reusing or redistributing this project.

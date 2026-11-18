import { createFileRoute, Link } from "@tanstack/react-router";
import { FUTURE_ROADMAP } from "@/data";
import { EVIDENCE_BASE } from "@/data/dataset-links";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — UrbanTwinReadiness" },
      {
        name: "description",
        content:
          "UrbanTwinReadiness is a web-based decision-support tool that shows a city which free satellite data to add to its digital twin for floods and droughts.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold text-muted-foreground">About</p>
      <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">What this tool does</h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/85">
        <p className="text-lg text-foreground">
          UrbanTwinReadiness is a web-based decision-support tool for city administrations. It tells
          a city which data its digital twin needs to assess floods and droughts early, and which
          free satellite data can fill the gaps.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "Choose what matters",
              "Pick the water challenge and the city objectives you care about, for example flood response or drought monitoring.",
            ],
            [
              "Say where your city starts",
              "From “nothing yet” to an advanced twin. Optionally mark the data you already have.",
            ],
            [
              "Get the minimum",
              "A short list of free satellite data to add first, with links to where to download it, and what to improve later.",
            ],
          ].map(([t, d], n) => (
            <li key={t} className="rounded-lg border border-border bg-card p-5 shadow-card">
              <p className="font-serif text-lg text-foreground">
                {n + 1}. {t}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Who it is for</h2>
        <p>
          City administrations, urban planners and environmental agencies, including staff without a
          technical background. Researchers and students can use it to see how a digital twin is
          built up step by step. The tool supports early scoping and discussion with stakeholders.
          It is <em>not</em> a substitute for a formal technical feasibility study.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">What it covers now</h2>
        <p>
          The current version covers <strong>floods</strong> and <strong>droughts</strong>. Heat is
          treated only as a drought-related stress. Other city objectives, such as air quality,
          energy and mobility, are planned extensions.
        </p>
        <p>
          Satellite data are a fallback, not a replacement. If your city already has better local
          data, for example a LiDAR terrain model, keep using it.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">
          Where the recommendations come from
        </h2>
        <p>
          The lists are based on two literature reviews and on a worked example, the digital twin of
          Turin. The priorities are expert judgement and are meant for screening, not forecasting.
          You can read the{" "}
          <Link to="/turin" className="text-primary underline underline-offset-2">
            Turin example
          </Link>{" "}
          to see which data the city already had and what was added from satellites.
        </p>
        <ul className="list-none space-y-2 text-sm text-muted-foreground">
          {EVIDENCE_BASE.map((e) => (
            <li key={e.url}>
              <a
                href={e.url}
                className="text-primary underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                {e.short}
              </a>
              : {e.citation}
            </li>
          ))}
        </ul>

        <details className="group !mt-12 rounded-xl border border-border bg-card p-5 shadow-card">
          <summary className="cursor-pointer font-serif text-xl text-foreground">
            Background: digital twins, maturity levels and data types
          </summary>
          <div className="mt-6 space-y-6">
            <h2 className="font-serif text-xl text-foreground">What is a Digital Twin?</h2>
            <p>
              Across the literature, the most widely accepted understanding of a digital twin is a
              dynamic digital representation of a physical asset, system, or city that integrates
              data, supports monitoring and simulation, and, in more advanced cases, enables
              feedback from the digital back to the physical system (Abdelrahman et al., 2025; Jones
              et al., 2020). An Urban Digital Twin applies this concept at city scale: it combines
              spatial representations with data from multiple sources, maintains a dynamic
              connection with real-world conditions through regular or real-time updates, and
              supports analytical functions such as simulation, forecasting, and scenario testing.
            </p>
            <p>
              It is useful to distinguish a digital twin from the predecessor technologies it builds
              on. 3D city models provide geometry and visualisation only; Building Information
              Modelling (BIM) adds detailed asset-level information; digital shadows introduce
              automated, one-directional data flows from the physical world to the digital
              representation. A digital twin is distinguished by a two-way connection — in its most
              advanced form, it can send information back to influence the physical city itself
              (adapted from Peldon et al., 2024).
            </p>

            <div className="!mt-8 overflow-hidden rounded-xl border border-border shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-card">
                      <th className="border-b border-border px-4 py-3 text-xs font-semibold text-muted-foreground"></th>
                      <th className="border-b border-border px-4 py-3 font-serif text-base text-foreground">
                        3D City Model
                      </th>
                      <th className="border-b border-border px-4 py-3 font-serif text-base text-foreground">
                        BIM Model
                      </th>
                      <th className="border-b border-border px-4 py-3 font-serif text-base text-foreground">
                        Digital Shadow
                      </th>
                      <th className="border-b border-border px-4 py-3 font-serif text-base text-foreground">
                        Digital Twin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/85">
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        What it shows
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Geometry &amp; appearance
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Detailed building/asset info
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Live physical → digital feed
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Live, two-way physical ↔ digital
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        How it updates
                      </td>
                      <td className="border-b border-border px-4 py-3">Never (static)</td>
                      <td className="border-b border-border px-4 py-3">Manual entry</td>
                      <td className="border-b border-border px-4 py-3">
                        Automatic, one direction only
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Automatic, both directions
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">
                        Can it control anything?
                      </td>
                      <td className="px-4 py-3">No</td>
                      <td className="px-4 py-3">No</td>
                      <td className="px-4 py-3">No</td>
                      <td className="px-4 py-3">Yes — sends signals back to the real world</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h2 className="!mt-8 font-serif text-xl text-foreground">Technical maturity levels</h2>
            <p>
              Existing maturity frameworks commonly distinguish between systems that primarily
              support visualisation and those capable of real-time monitoring, predictive analytics,
              scenario simulation, and, in some cases, automated decision support (Masoumi et al.,
              2023; Hartmann and Wimmer, 2025). This tool structures its technical maturity levels
              around the five-stage classification used in the author&rsquo;s related survey of
              Urban Digital Twin adoption across national and subnational governments —{" "}
              <strong>Static Digital Model</strong>, <strong>Analytical Digital Twin</strong>,{" "}
              <strong>Predictive Digital Twin</strong>, <strong>Prescriptive Digital Twin</strong>,
              and <strong>Autonomous Digital Twin</strong> — which is broadly consistent with the
              static → real-time-enriched → two-way interactive → autonomous spectrum described in
              the wider literature (e.g. Liu et al., 2024; The Institution of Engineering and
              Technology, 2025). Each level in the configurator reflects not only how much data a
              twin holds, but what it is capable of doing with it.
            </p>

            <h2 className="!mt-8 font-serif text-xl text-foreground">
              The data foundations of a UDT
            </h2>
            <p>
              A UDT mirrors the physical city through heterogeneous data feeds that vary
              significantly in their update frequency, spatial resolution, and analytical purpose.
              Rather than a single source, it is the layered integration of ten distinct data
              categories that together constitute a twin&rsquo;s representation of the city — from
              the static geospatial backbone to dynamic, real-time and participatory feeds.
            </p>

            <div className="!mt-8 overflow-hidden rounded-xl border border-border shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-card">
                      <th className="border-b border-border px-4 py-3 font-serif text-base text-foreground">
                        Data type
                      </th>
                      <th className="border-b border-border px-4 py-3 font-serif text-base text-foreground">
                        Examples
                      </th>
                      <th className="border-b border-border px-4 py-3 font-serif text-base text-foreground">
                        Role in UDTs
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/85">
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Geospatial
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        2D/3D city models, cadastral data, land use, topography
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Provides the geometric and spatial backbone representing the city&rsquo;s
                        terrain and built assets.
                      </td>
                    </tr>
                    <tr className="bg-primary/5">
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Earth Observation
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Satellite and aerial imagery, LiDAR point clouds, Mobile Mapping Systems
                        (MMS)
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Enables high-fidelity reality capture and environmental monitoring at scale
                        — particularly valuable for constructing and periodically updating 3D city
                        models, monitoring land cover change, detecting urban heat islands, and
                        assessing vegetation coverage.
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Urban/regional planning &amp; regulatory
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Zoning plans, land-use plans
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Provides the legal and contextual framework for simulating policy impacts.
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Real-time sensor &amp; IoT
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Traffic sensors, air quality sensors, weather stations, smart meters
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Acts as the dynamic component, allowing the twin to mirror current
                        conditions rather than past states.
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Administrative
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Building permits, land registry, tax records, business registry, customs
                        data
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Links virtual objects to authoritative institutional records for management
                        and permitting.
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Statistical
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Population statistics, socio-economic indicators
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Adds a social dimension, helping model demographics and equity within urban
                        systems.
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Mobility &amp; transport
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Public transport data: traffic flows, GPS data, mobility services
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Supports dynamic simulation of people and goods movement to optimise
                        networks.
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Utility &amp; infrastructure network
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Water, electricity, gas networks, telecommunications, sewer systems
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Monitors critical lifeline systems to improve operational efficiency and
                        resilience.
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-border px-4 py-3 font-medium text-foreground">
                        Commercial / private-sector
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Telecom data, mobility platforms, real estate data
                      </td>
                      <td className="border-b border-border px-4 py-3">
                        Provides granular third-party insights on market trends and urban activity
                        patterns.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">
                        Participatory / citizen-contributed
                      </td>
                      <td className="px-4 py-3">
                        Public consultations, surveys, crowdsourcing, community reporting
                      </td>
                      <td className="px-4 py-3">
                        Fosters inclusive governance by incorporating citizen feedback and lived
                        experience.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Product roadmap</h2>
        <p>
          UrbanTwinReadiness is developed iteratively as a doctoral research prototype. Each version
          extends the tool&rsquo;s own scope, from minimum dataset readiness toward a discoverable,
          visual and integrated decision-support environment.
        </p>

        <ol className="!mt-6 space-y-4">
          {FUTURE_ROADMAP.map((step) => (
            <li
              key={step.version}
              className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-card sm:grid-cols-[120px_1fr] sm:gap-6"
            >
              <div>
                <p className="text-xs font-semibold text-accent">{step.version}</p>
                <span
                  className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    step.status === "current"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "current" ? "Current" : "Planned"}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="!mt-6 rounded-xl border border-dashed border-border bg-surface-elevated p-6">
          <p className="text-xs font-semibold text-accent">Future data visualization</p>
          <h3 className="mt-2 font-serif text-lg text-foreground">
            An interactive visualizer is planned
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            Future versions will include an interactive map for exploring recommended datasets and
            Open Spatial Layers, inspecting their metadata, and previewing how they combine within
            an Urban Digital Twin. Not part of the current research prototype.
          </p>
        </div>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Status</h2>
        <p>
          This application is a research prototype developed in the context of doctoral research at Politecnico di Torino
          on Urban Digital Twins for environmental management.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">References</h2>
        <ul className="list-none space-y-2 text-sm text-muted-foreground">
          <li>
            Abdelrahman, M. et al. (2025), &ldquo;What is a Digital Twin anyway? Deriving the
            definition for the built environment from over 15,000 scientific publications&rdquo;,{" "}
            <em>Building and Environment</em>, Vol. 274.
          </li>
          <li>
            Hartmann, M. and M. Wimmer (2025), &ldquo;Maturity Models for Digital Twins in Smart
            Cities — Literature Review and Comparison&rdquo;, in{" "}
            <em>Lecture Notes in Computer Science, Electronic Government</em>, Springer.
          </li>
          <li>
            The Institution of Engineering and Technology (2025),{" "}
            <em>Digital twins for the built environment</em>.
          </li>
          <li>
            International Organization for Standardization / International Electrotechnical
            Commission (2025), generic digital twin maturity model and guidance for maturity
            assessment.
          </li>
          <li>
            Jones, D. et al. (2020), &ldquo;Characterising the Digital Twin: A systematic literature
            review&rdquo;, <em>CIRP Journal of Manufacturing Science and Technology</em>, Vol. 29,
            pp. 36–52.
          </li>
          <li>
            Liu, Y. et al. (2024), &ldquo;A review of digital twin capabilities, technologies, and
            applications based on the maturity model&rdquo;,{" "}
            <em>Advanced Engineering Informatics</em>, Vol. 62, p. 102592.
          </li>
          <li>
            Masoumi, H. et al. (2023), &ldquo;City Digital Twins: their maturity level and
            differentiation from 3D city models&rdquo;, <em>Big Earth Data</em>, Vol. 7/1, pp. 1–36.
          </li>
          <li>
            Peldon, D. et al. (2024), &ldquo;Navigating urban complexity: The transformative role of
            digital twins in smart city development&rdquo;, <em>Sustainable Cities and Society</em>,
            Vol. 111, p. 105583.
          </li>
        </ul>
      </div>

      <div className="mt-12 rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-serif text-xl text-foreground">Run an assessment</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your objectives, say where your city starts, and get the list of data to add first.
        </p>
        <Link
          to="/configure"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

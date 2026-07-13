export type CapabilityArt = {
  id: string;
  label: string;
  accent: string;
  src: string;
  alt: string;
};

// Static editorial artwork for the capability gallery. Each asset is an
// Image 2 transformation of a licensed photographic reference; see
// CARD_ART_SOURCES.md for provenance.
export const CAPABILITIES: CapabilityArt[] = [
  {
    id: "microservices",
    label: "MICROSERVICES · DISTRIBUTED OWNERSHIP",
    accent: "#6965B5",
    src: "/assets/cards/capabilities/microservices-tech-art-v1.webp",
    alt: "Three independent smoked-glass service modules linked by a violet structural path.",
  },
  {
    id: "kubernetes",
    label: "KUBERNETES · SELF-HEALING DELIVERY",
    accent: "#57E39B",
    src: "/assets/cards/capabilities/kubernetes-tech-art-v1.webp",
    alt: "A resilient mint-lit cluster of steel and glass service pods around a stable core.",
  },
  {
    id: "multi-agent",
    label: "MULTI-AGENT · CONTROLLED COLLABORATION",
    accent: "#BB4F9F",
    src: "/assets/cards/capabilities/multi-agent-tech-art-v1.webp",
    alt: "Four magenta signal paths converge from separate modules at one translucent decision gate.",
  },
  {
    id: "cloud-callbacks",
    label: "CLOUD SYSTEMS · ASYNC CALLBACKS",
    accent: "#EBB268",
    src: "/assets/cards/capabilities/cloud-callbacks-tech-art-v1.webp",
    alt: "An amber callback signal travels through a glass arc between two steel service capsules.",
  },
  {
    id: "websocket",
    label: "WEBSOCKET · LIVE STATE",
    accent: "#57E39B",
    src: "/assets/cards/capabilities/websocket-tech-art-v1.webp",
    alt: "Two smoked-glass terminals exchange a continuous mint live-state signal.",
  },
  {
    id: "postgis",
    label: "POSTGIS · LOCATION INTELLIGENCE",
    accent: "#6965B5",
    src: "/assets/cards/capabilities/postgis-tech-art-v1.webp",
    alt: "Layered dark topographic contours are cut through by a violet coordinate stream.",
  },
  {
    id: "computer-vision",
    label: "COMPUTER VISION · HUMAN SIGNAL",
    accent: "#BB4F9F",
    src: "/assets/cards/capabilities/computer-vision-tech-art-v1.webp",
    alt: "A smoked optical lens resolves one glowing signal plane among translucent facets.",
  },
  {
    id: "generative-video",
    label: "GENERATIVE VIDEO · MEDIA PIPELINES",
    accent: "#EBB268",
    src: "/assets/cards/capabilities/generative-video-tech-art-v1.webp",
    alt: "Layered translucent film frames carry an amber signal ribbon toward a bright render point.",
  },
  {
    id: "grpc",
    label: "gRPC · PROTOCOL BUFFERS",
    accent: "#6965B5",
    src: "/assets/cards/capabilities/grpc-tech-art-v1.webp",
    alt: "A compact violet conduit carries a direct typed connection between two steel protocol blocks.",
  },
  {
    id: "cicd",
    label: "CI/CD · CONTROLLED RELEASES",
    accent: "#57E39B",
    src: "/assets/cards/capabilities/cicd-tech-art-v1.webp",
    alt: "A mint verification beam passes through five release gates to a final illuminated platform.",
  },
  {
    id: "observability",
    label: "OBSERVABILITY · TRACE TO CAUSE",
    accent: "#BB4F9F",
    src: "/assets/cards/capabilities/observability-tech-art-v1.webp",
    alt: "Several translucent magenta traces resolve at a single bright root-cause prism.",
  },
  {
    id: "data-systems",
    label: "DATA SYSTEMS · ONE PRODUCT STATE",
    accent: "#EBB268",
    src: "/assets/cards/capabilities/data-systems-tech-art-v1.webp",
    alt: "Several amber data channels merge into one translucent stable-state reservoir.",
  },
];

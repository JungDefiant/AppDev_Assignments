import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/_index.tsx"),
	route("gallery", "routes/gallery.tsx"),
	route("recipe/:entryid", "routes/recipe.$id.tsx"),
] satisfies RouteConfig;

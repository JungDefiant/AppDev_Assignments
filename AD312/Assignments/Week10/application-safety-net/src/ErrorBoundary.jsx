import {
	Component,
	captureOwnerStack,
	logErrorToMyService,
	getDerivedStateFromError,
} from "react";

export class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { error: false };
	}

	static getDerivedStateFromError(error) {
		return { error: true };
	}

	componentDidCatch(error, info) {
		console.error("Error info:", [error, info.componentStack]);
	}

	render() {
		if (this.state.error) {
			return this.props.fallback;
		}

		return this.props.children;
	}
}

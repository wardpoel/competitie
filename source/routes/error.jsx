import React from 'react';

import { useNavigate, useLocation } from 'react-sprout';

import ErrorView from '../views/error.jsx';

class ErrorBoundaryClass extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleResolve = this.handleResolve.bind(this);
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	handleResolve() {
		this.setState({ error: undefined });
	}

	render() {
		let { error } = this.state;

		if (error) {
			return <ErrorView error={error} onResolve={this.handleResolve} />;
		}

		return this.props.children;
	}
}

export default function ErrorBoundary(props) {
	let navigate = useNavigate();
	let location = useLocation();

	return <ErrorBoundaryClass {...props} navigate={navigate} location={location} />;
}

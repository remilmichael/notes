import React, { Component } from 'react';
import Navbar from './component/UI/NavBar/Navbar';
import { Route, Switch } from 'react-router-dom';
import NoteEditor from './container/NoteEditor/NoteEditor';
import Auth from './container/Auth/Auth';
import Logout from './container/Auth/Logout/Logout';
import MainPage from './container/MainPage/MainPage';
import TodoViewer from './container/Todo/Viewer/TodoViewer';
import TodoEditor from './container/Todo/Editor/TodoEditor';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';
import './App.css';

let routes = null;

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoLogin();
  }

  render() {
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/note" component={NoteEditor} />
          <Route path="/logout" component={Logout} exact />
          <Route path="/login" component={Auth} exact />
          <Route path="/todo" component={TodoEditor} />
          <Route path="/todoviewer" component={TodoViewer} />
          <Route path="/" component={MainPage} />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path="/todoviewer" component={TodoViewer} />
          <Route path="/note" component={NoteEditor} />
          <Route path="/todo" component={TodoEditor} />
          <Route path="/login" component={Auth} exact />
          <Route path="/" component={MainPage} />
        </Switch>
      );
    }

    return (
      <React.Fragment>
        <Navbar />
        {routes}
      </React.Fragment>
    );
  }
}

export const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.idToken !== null
  };
}

export const mapDispatchToProps = dispatch => {
  return {
    onTryAutoLogin: () => dispatch(actions.tryAutoLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./utils/PrivateRoute";
import Home from "./components/Home";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { PostProvider } from "./context/PostContext";
import Profile from "./components/profile/Profile";
import LandingPage from "./components/LandingPage";
import SinglePost from "./components/SinglePost";
import UserProfile from "./components/userProfile/UserProfile";
import "./App.css";
export default function App() {
  return (
    <Router>
     <BrowserRouter basename="/Social-Hunt">
      <UserProvider>
        <PostProvider>
          <Switch>
            <Route exact path="/landing" component={LandingPage}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/signup" component={Signup}></Route>
            <PrivateRoute
              exact
              path="/profile"
              component={Profile}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/post/:postId"
              component={SinglePost}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path="/userProfile/:userId"
              component={UserProfile}
            ></PrivateRoute>
            <PrivateRoute exact path="/" component={Home}></PrivateRoute>
          </Switch>
        </PostProvider>
      </UserProvider>
     </BrowserRouter>
    </Router>
  );
}

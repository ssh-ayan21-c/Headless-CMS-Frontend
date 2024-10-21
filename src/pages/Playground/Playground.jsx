import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../Dashboard/Dashboard";

import "./Playground.css";

import LeftPanel from "../../components/SidePanel/SidePanel";
import Draftboard from "../Draftboard/Draftboard";
import { RefreshProvider } from "../../contexts/refresh";
import Categories from "../Categories/Categories";
import AuthorProfile from "../AuthorProfile/AuthorProfile";
import Analytics from "../Analytics/Analytics";
import TopPanel from "../../components/TopPanel/TopPanel";
import { useTheme } from "../../contexts/theme";
import { UserProvider } from "../../contexts/user";

function Panel() {
  const { theme } = useTheme();

  return (
    <>
      <UserProvider>
        <TopPanel />
      </UserProvider>

      <div id="playground" className={`playground-${theme}`}>
        <LeftPanel />
        <div className="right">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <UserProvider>
                  <Analytics />
                </UserProvider>
              }
            />
            <Route
              path="/featured-blogs"
              element={
                <RefreshProvider>
                  <Dashboard />
                </RefreshProvider>
              }
            />
            <Route
              path="/all-blogs"
              element={
                <RefreshProvider>
                  <Draftboard />
                </RefreshProvider>
              }
            />
            <Route path="/categories" element={<Categories />} />
            <Route path="/edit-profile" element={<AuthorProfile />} />
            <Route path="/change-password" element={<AuthorProfile />} />
            <Route path="/get-api-key" element={<AuthorProfile />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Panel;

"use client";

import { useState } from "react";
import TopBannerHeader from "./_components/TopBannerHeader";
import TopBannerHeaderTools from "./_components/TopBannerHeaderTools";
import TopBannerForm from "./TopBannerForm";

const TopBannersView = () => {
  const [tabValue, setTabValue] = useState("home");
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-5">
      <TopBannerHeader />
      <TopBannerHeaderTools
        searchValue={query}
        tabValue={tabValue}
        onChangeSearch={(v) => setQuery(v)}
        onTabChange={(v) => setTabValue(v)}
      />
      <TopBannerForm pageType={tabValue} query={query} />
    </div>
  );
};

export default TopBannersView;

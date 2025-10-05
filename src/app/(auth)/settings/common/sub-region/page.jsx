import MasterTable from "@/components/masterTable/MasterTable";
import React from "react";

const RegionPage = () => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Region Name", dataIndex: "name", key: "name" },
  ];

  return (
    <MasterTable
      apiEndpoint="/common/subregions"
      columns={columns}
      title="Region Listing"
    />
  );
};

export default RegionPage;

import MasterTable from "@/components/masterTable/MasterTable";
import React from "react";

const StatePage = () => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "State Name", dataIndex: "name", key: "name" },
    {
      title: "State Code",
      dataIndex: "state_code",
      key: "state_code",
      width: 100,
    },
    { title: "Country", dataIndex: "country_name", key: "country_name" },
    {
      title: "Country Code",
      dataIndex: "country_code",
      key: "country_code",
      width: 100,
    },
  ];

  return (
    <MasterTable
      apiEndpoint="/common/states"
      columns={columns}
      title="State Listing"
    />
  );
};

export default StatePage;

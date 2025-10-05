import MasterTable from "@/components/masterTable/MasterTable";
import React from "react";

const CityPage = () => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "City Name", dataIndex: "name", key: "name" },
    { title: "State", dataIndex: "state_name", key: "state_name" },
    { title: "Country", dataIndex: "country_name", key: "country_name" },
    {
      title: "State Code",
      dataIndex: "state_code",
      key: "state_code",
      width: 100,
    },
  ];

  return (
    <MasterTable
      apiEndpoint="/common/cities"
      columns={columns}
      title="City Listing"
    />
  );
};

export default CityPage;

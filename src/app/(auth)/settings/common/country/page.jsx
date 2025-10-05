import MasterTable from "@/components/masterTable/MasterTable";
import React from "react";

const CountryPage = () => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Country Name", dataIndex: "name", key: "name" },
    { title: "ISO2", dataIndex: "iso2", key: "iso2", width: 80 },
    {
      title: "Phone Code",
      dataIndex: "phonecode",
      key: "phonecode",
      width: 100,
    },
    { title: "Region", dataIndex: "region", key: "region" },
    { title: "Subregion", dataIndex: "subregion", key: "subregion" },
  ];

  return (
    <MasterTable
      apiEndpoint="/common/countries"
      columns={columns}
      title="Country Listing"
    />
  );
};

export default CountryPage;

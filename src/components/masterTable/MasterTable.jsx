"use client";

import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";

const MasterTable = ({ apiEndpoint, columns, pageSize = 20, title = "" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
    total: 0,
  });

  const fetchData = async (page = 1, limit = pageSize) => {
    try {
      setLoading(true);

      const skip = (page - 1) * limit;

      const response = await HTTPRequest().getAction(
        null,
        `${apiEndpoint}?limit=${limit}&skip=${skip}`,
        true
      );

      if (response?.success) {
        setData(response.data);
        setPagination({
          current: page,
          pageSize: limit,
          total: response.meta?.total || response.data.length,
        });
      } else {
        selfMessage(`Failed to fetch data from ${apiEndpoint}`, "error");
      }
    } catch (error) {
      console.error(error);
      selfMessage(`Error fetching data from ${apiEndpoint}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag) => {
    fetchData(pag.current, pag.pageSize);
  };

  return (
    <div style={{ padding: 24 }}>
      {title && <h2 style={{ marginBottom: 16 }}>{title}</h2>}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
        />
      )}
    </div>
  );
};

export default MasterTable;

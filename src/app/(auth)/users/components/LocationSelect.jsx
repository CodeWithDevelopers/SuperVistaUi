"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Select, Spin } from "antd";
import HTTPRequest from "@/services/request";
import debounce from "lodash/debounce";

const LocationSelect = ({
  type, // 'country', 'state', or 'city'
  value,
  onChange,
  placeholder,
  disabled = false,
  countryId = null, // Required for state select
  stateId = null, // Required for city select
  style = {},
  allowClear = true,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch options based on type
  const fetchOptions = useCallback(
    async (search = "") => {
      if (type === "state" && !countryId) return;
      if (type === "city" && !stateId) return;

      setLoading(true);
      try {
        let endpoint = "";
        let params = {
          limit: 50,
          page: 1,
        };

        if (search) {
          params.search = search;
        }

        switch (type) {
          case "country":
            endpoint = "/common/countries";
            break;
          case "state":
            endpoint = "/common/states";
            params.countryId = countryId;
            break;
          case "city":
            endpoint = "/common/city";
            params.stateId = stateId;
            break;
          default:
            return;
        }

        const response = await HTTPRequest().getAction(params, endpoint, true);

        if (response?.success) {
          const data = response.data || [];
          const formattedOptions = data.map((item) => ({
            label: item.name,
            value: item.id,
            data: item, // Store full data for reference
          }));
          setOptions(formattedOptions);
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [type, countryId, stateId]
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchText) => {
      fetchOptions(searchText);
    }, 500),
    [fetchOptions]
  );

  // Initial load and when dependencies change
  useEffect(() => {
    fetchOptions();
    // Cleanup debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [fetchOptions, debouncedSearch]);

  // Handle search
  const handleSearch = (searchText) => {
    setSearchValue(searchText);
    if (searchText) {
      debouncedSearch(searchText);
    } else {
      fetchOptions();
    }
  };

  // Handle change
  const handleChange = (selectedValue, option) => {
    if (onChange) {
      onChange(selectedValue, option);
    }
  };

  // Clear dependent fields when parent changes
  useEffect(() => {
    if (type === "state" && !countryId) {
      setOptions([]);
      if (value) {
        handleChange(null);
      }
    }
    if (type === "city" && !stateId) {
      setOptions([]);
      if (value) {
        handleChange(null);
      }
    }
  }, [countryId, stateId, type]);

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder || `Select ${type}`}
      style={{ width: "100%", ...style }}
      disabled={
        disabled ||
        (type === "state" && !countryId) ||
        (type === "city" && !stateId)
      }
      loading={loading}
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      filterOption={false}
      allowClear={allowClear}
      notFoundContent={loading ? <Spin size="small" /> : "No data found"}
    />
  );
};

export default LocationSelect;

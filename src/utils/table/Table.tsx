import React, { memo, useEffect, useState } from "react";
import "./table.css";
import TablePagination from "./TablePagination";

interface Loader {
  component: JSX.Element;
  loading: boolean;
}

interface TableProps<T, R> {
  handleRowClick?: (obj: any) => void;
  headers: Array<T>;
  tableData: Array<R>;
  tHeadClassName?: string;
  tBodyClassName?: string;
  className?: string;
  pagination?: boolean;
  paginationAlign?: string;
  paginationClassName?: string;
  loader?: Loader;
}

const TaskTable = memo(<T, R>(props: TableProps<T, R>) => {
  const {
    handleRowClick = (obj) => obj,
    headers = [],
    tableData = [],
    tHeadClassName = "",
    tBodyClassName = "",
    className = "task-table",
    pagination = false,
    paginationAlign = "center",
    paginationClassName = "table-pagination",
    loader = { component: <>Loading..</>, loading: false },
    ...args
  } = props;
  const dt = tableData.map((val, idx) => {
    return { ...val, serialNo: idx + 1 };
  });
  const [formattedData, setFormattedData] = useState(dt);
  const [currentPageData, setCurrentPageData] = useState<any>([]);
  useEffect(() => {
    setFormattedData(dt);
    pagination ? setCurrentPageData(dt.slice(0, 5)) : setCurrentPageData(dt);
  }, [tableData]);
  const renderHeader = (header: any, idx: number) => {
    switch (header.node) {
      case "select": {
        return (
          <th key={idx}>
            <span>{header.title}</span>
            <select
              onChange={(e) => header?.onClick(e, header)}
              name={header.key}
            >
              {header?.values?.map((opt: any, idx: number) => (
                <option key={idx} value={opt?.value}>
                  {opt?.key || opt}
                </option>
              ))}
            </select>
          </th>
        );
      }
      default:
        return (
          <th key={idx}>
            <div onClick={header.onClick} className="table-thead">
              <span>{header.title} </span>
              {header.sort && (
                <div className="sort-fields">
                  <span
                    title="Ascending order"
                    onClick={() => header?.sort(header.key, "asc")}
                  >
                    {" "}
                    &and;
                  </span>
                  <span
                    title="Descending order"
                    onClick={() => header?.sort(header.key, "desc")}
                  >
                    {" "}
                    &or;
                  </span>
                </div>
              )}
            </div>
          </th>
        );
    }
  };
  const renderBodyRow = (obj: any, idx: number) => {
    return (
      <tr onClick={() => handleRowClick(obj)} key={idx}>
        {headers.map((val1: any, index) => {
          if (val1?.key == "serialNo") {
            return <td key={index}>{obj.serialNo}. </td>;
          }
          const hasOption = !val1.tdFormat && val1?.key.split(".");
          return val1.tdFormat ? (
            <td key={index}>{val1.tdFormat(obj)}</td>
          ) : (
            <td key={index}>
              {hasOption.length == 1
                ? obj[val1.key]
                : obj[hasOption[0]]?.[hasOption[1]]}
            </td>
          );
        })}
      </tr>
    );
  };
  return (
    <>
      <table className={className} {...args}>
        <thead className={tHeadClassName}>
          <tr>{headers.map((header, idx) => renderHeader(header, idx))}</tr>
        </thead>
        <tbody className={tBodyClassName}>
          {loader.loading ? (
            <tr>
              <td colSpan={headers.length}>
                {loader.component ? loader.component : <div>Loading...</div>}
              </td>
            </tr>
          ) : (
            currentPageData.map((obj: any, idx: number) =>
              renderBodyRow(obj, idx),
            )
          )}
        </tbody>
      </table>
      {pagination && (
        <TablePagination
          paginationClassName={paginationClassName}
          paginationAlign={paginationAlign}
          tableData={formattedData}
          setCurrentPageData={setCurrentPageData}
        />
      )}
    </>
  );
});

TaskTable.displayName = "TaskTable";
export default TaskTable;

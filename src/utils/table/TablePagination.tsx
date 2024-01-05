import React, { memo, useEffect, useState } from "react";

interface TablePaginationProps<T> {
    tableData: Array<T>;
    setCurrentPageData: React.Dispatch<React.SetStateAction<any>>;
    paginationAlign: string;
    paginationClassName: string;
}

const TablePagination = memo(
    <T,>({
        tableData,
        setCurrentPageData,
        paginationAlign,
        paginationClassName,
    }: TablePaginationProps<T>) => {
        const defaultPageSize = 5;
        const [pageSize, setPageSize] = useState<number>(defaultPageSize);
        const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
        const dataLength = tableData.length;
        const pagesLength: number[] = [
            ...Array(Math.ceil(dataLength / pageSize)).keys(),
        ];
        const lastPage = pagesLength[pagesLength.length - 1] || 0;
        const renderPageSizeOptions = () => {
            if (dataLength > 50) return [5, 10, 20, 50, dataLength];
            else if (dataLength > 20) return [5, 10, 20, dataLength];
            else if (dataLength > 10) return [5, 10, dataLength];
            else if (dataLength > 5) return [5, dataLength];
            return [5, 10, 15, 20];
        };
        // console.log('PAGES',{ pagesLength, tableData, currentPageIndex, pageSize, lastPage})
        const handlePageSizeChange = (e: any) => {
            setCurrentPageIndex(0);
            setPageSize(e.target.value);
        };
        const previousFunc = () => {
            setCurrentPageIndex(currentPageIndex - 1);
        };
        const nextFunc = () => {
            setCurrentPageIndex(currentPageIndex + 1);
        };
        const renderPageIndexes = (data: any) => {
            if (currentPageIndex == 0) return data.slice(0, 4);
            if (currentPageIndex == lastPage) return data.slice(-4);
            const startIndex = currentPageIndex > 2 ? currentPageIndex - 2 : 0;
            const endIndex =
                currentPageIndex < lastPage ? currentPageIndex + 2 : currentPageIndex;
            const val = data.slice(startIndex, endIndex);
            return val;
        };
        useEffect(() => {
            const currentData = tableData.slice(
                currentPageIndex * pageSize,
                currentPageIndex * pageSize + Number(pageSize),
            );
            setCurrentPageData(currentData);
        }, [pageSize, currentPageIndex, tableData]);
        return (
            <div
                className={paginationClassName}
                style={{ justifyContent: paginationAlign }}
            >
                <button
                    className="next-btn"
                    disabled={currentPageIndex == 0}
                    onClick={() => setCurrentPageIndex(0)}
                >{`<<`}</button>
                <button
                    className="prev-btn"
                    disabled={currentPageIndex == 0}
                    onClick={previousFunc}
                >{`< `}</button>
                {renderPageIndexes(pagesLength).map((page: any, idx: number) => (
                    <span
                        className={`${currentPageIndex == page && "selected"}`}
                        onClick={() => setCurrentPageIndex(page)}
                        key={idx}
                    >
                        {page + 1}
                    </span>
                ))}
                <button
                    disabled={currentPageIndex == lastPage}
                    className="next-btn"
                    onClick={nextFunc}
                >{`>`}</button>
                <button
                    disabled={currentPageIndex == lastPage}
                    className="next-btn"
                    onClick={() => setCurrentPageIndex(lastPage)}
                >{`>>`}</button>
                {defaultPageSize && (
                    <select
                        onChange={handlePageSizeChange}
                        className="table-pagesize-dropdown"
                    >
                        {renderPageSizeOptions().map((val, idx) => (
                            <option key={idx}>{val}</option>
                        ))}
                    </select>
                )}
                <span>
                    {" "}
                    {currentPageIndex + 1} of {lastPage + 1} Pages
                </span>
            </div>
        );
    },
);

TablePagination.displayName = "TablePagination"
export default TablePagination;

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

interface IColumnDef {
  headerName: string;
  field?: string;
  sortable?: boolean;
  filter?: boolean;
  headerCheckboxSelection?: boolean;
  checkboxSelection?: boolean;
  flex: number;
  lockPosition?: boolean;
}

interface IRowData {
  keys: Array<string>;
  totalKeyCount: number;
  pageSize: number;
  totalPages: number;
}

interface GridProps {
  rowData: any;
  handleGetSelectedRows: (row: Array<IRowData>) => void;
}

const Grid: React.FC<GridProps> = ({ rowData, handleGetSelectedRows }) => {
  const [gridApi, setGridApi] = useState<null | any>(null);
  const [numFields, setNumFields] = useState<number>(1);
  const [destructuredKeys, setDestructuredKeys] = useState<null | any>(null);
  const [columnDefs, setColumnDefs] = useState<Array<IColumnDef>>([
    {
      headerName: "Select",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      flex: 1,
    },
    {
      headerName: "Key Name",
      field: "field0",
      sortable: true,
      filter: true,
      flex: 2,
    },
  ]);

  /**
   * Adds data of rows selected in the grid to an array that is passed to Main.tsx
   * @return Array of objects as it is stored in the grid (keys will be destructured)
   */

  const handleSelected = () => {
    const selectedData = gridApi.getSelectedRows();
    handleGetSelectedRows(selectedData);
  };

  /**
   *Finds number of columns needed in grid by counting max number of fields needed
   * @param rowData
   * @return sets NumFields state to a number
   */

  const findNumColumns = (rowData: any) => {
    let n: number = 1;
    rowData?.keys?.map((key: any) => {
      const split = key?.keyName?.split("#");
      if (split?.length > numFields) {
        n = split?.length;
      }
      return split;
    });
    setNumFields(n);
  };

  /**
   * Creates columns definitions for AgGrid based on the number of fields (numFields) needed
   * @return sets ColumnDefs state to Array<IColumnDef>
   */

  const makeColumns = () => {
    let i: number = 0;
    let column: IColumnDef;
    let columns: Array<IColumnDef> = [
      {
        headerName: "Select",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        lockPosition: true,
        flex: 1,
      },
    ];

    if (numFields > 1) {
      do {
        column = {
          headerName: `Field${i}`,
          field: `field${i}`,
          sortable: true,
          filter: true,
          flex: 2,
        };
        columns.push(column);
        i++;
      } while (i < numFields);

      setColumnDefs(columns);
    }
  };

  /**
   * Separates key strings into fields separated by `#`
   * @param rowData
   * @return Array of key objects
   */

  const destructureKeys = (rowData: any) => {
    let splitKeys: Array<object> = [];
    rowData?.keys?.map((key: any) => {
      const splitArr = key?.keyName?.split("#");
      let splitObj: object = {};
      let i: number = 0;

      do {
        splitObj = { ...splitObj, [`field${i}`]: splitArr[i] };
        i++;
      } while (i < splitArr?.length);

      splitKeys.push(splitObj);
      return splitObj;
    });
    setDestructuredKeys(splitKeys);
  };

  useEffect(() => {
    findNumColumns(rowData);
    // eslint-disable-next-line
  }, [rowData]);

  useEffect(() => {
    makeColumns();
    destructureKeys(rowData);
    //eslint-disable-next-line
  }, [numFields]);

  return (
    <div className="ag-theme-balham grid">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={destructuredKeys ? destructuredKeys : rowData.keys}
        rowSelection="multiple"
        onGridReady={(params) => {
          setGridApi(params.api);
        }}
        onRowSelected={handleSelected}
      />
    </div>
  );
};

export default Grid;

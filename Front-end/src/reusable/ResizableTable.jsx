import React, { useCallback, useEffect, useRef, useState } from "react";
import ColumnResizer from "column-resizer";
import { Table } from "react-bootstrap";

const ResizableTable = ({ children, resizable, resizeOptions, style, className, }) => {
  const tableRef = useRef(null);
  const [resize, setResize] = useState(null);

  const enableResize = useCallback(() => {
    if (tableRef.current && !resize) {
      const resizeFn = new ColumnResizer(tableRef.current, {
        ...resizeOptions,
        liveDrag: true,
        resizeMode: "fit",
      });
      // Remove className to avoid conflicts
      tableRef.current.className = tableRef.current?.className?.replace(
        "grip-padding",
        ""
      );
      setResize(resizeFn);
    } else if (resize) {
      resize.reset(resizeOptions);
    }
  }, [resize, resizeOptions]);

  const disableResize = useCallback(() => {
    if (resize) {
      resize.reset({ disable: true });
    }
  }, [resize]);

  useEffect(() => {
    if (tableRef.current && resizable) {
      enableResize();
    }
    return () => {
      disableResize();
    };
  }, [tableRef, resizable, enableResize, disableResize]);

  return (
    <Table striped hover bordered responsive ref={tableRef} style={style} className={className}>
      {children}
    </Table>
  );
};

export default ResizableTable;

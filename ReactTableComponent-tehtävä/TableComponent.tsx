import * as React from "react";
import { useEffect, useState } from "react";

/**
 * --------- Introduction ----------
 * This is my solution to fix these react function components
 * 
 * The component is table that contains rows with information.
 * Each row has some "content" and a button to hide it.
 * The content is inserted in a <span> tag which suggest it most likely is a string
 * but it could be possible to add Elements so it should be considered.
 * 
 * each row (TableItem) sends a request to some URL to fetch extra content, if said content is found it is added to the table.
 * 
 * The idea for the table is maybe to toggle some features on and off for specific users or applications
 */



/** ----------- Changes ------------
 * - Adding typings to component properties
 * - Brackets around 'style' value and changing to correct CSSProperty
 * - Change <div className="table-component"> to <table className="table-component"> element, we are clearly working with a table component
 * - Adding <tbody /> tag after table headers
 * - Add key property from an ID and index to table rows
 * ---------------------------------  */
const TableComponent = (props: TableProps) => {
    const { items, title } = props;

    return (
        <table className="table-component" style={{ "paddingTop": "5px" }}>
            <TableHeader title={title} />
            <tbody>
                {items &&
                    items.map((i, index) => {
                        return (
                            <tr key={"tableitem_" + index}>
                                <TableItem item={i}></TableItem>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

/** ----------- Changes ------------
 * - Table header uses title from table properties, add a Partial typing from TableProps
 * - Every time the setInterval invokes a hook to increment the timer, it will rerender the component and thus recreate the setInterval.
 * - To not have multiple intervals, clear the interval each time. This clock incrementing type thing could be done with a setTimeout also.
 * ---------------------------------  */
const TableHeader: React.FC<Partial<TableProps>> = ({ title }) => {
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer + 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [timer]);
    return (
        <thead>
            <tr>
                <th>{title} {timer}</th>
            </tr>
        </thead>
    );
};


/** ----------- Changes -------------
 * - Add property typings to table item
 * - the code :
  if (!content) {
    setOpen(false)
  }
  - Suggests that if item has no content then the initial state should be closed, so this can be shortened with useState(!!content)

 * instead of the code: 
  
  if (!extraContent) {
    return null
  }
  - We can just render the component and let the useEffect hook re-render when fetch has retuned extraContent with a response
 * - Adding also typings
 * ---------------------------------  */
function TableItem(props: TableItemProps) {
    const { content, href } = props.item;
    const [open, setOpen] = useState(!!content);
    const [extraContent, setExtraContent] = useState("");

    useEffect(() => {
        fetch(href).then((response: ExtraResponse) => {
            if (response.extraContent) {
                setExtraContent(response.extraContent);
            }
        });
    });

    return (
        <>
            <td>
                <button
                    className="table-component-toggle-content"
                    onClick={(e) => setOpen(!open)}>
                    Toggle content
                </button>
            </td>
            <td>
                <span
                    style={{ display: open ? "block" : "none" }}
                    className="table-component-content">
                    {content}
                </span>
            </td>
            <td>
                {
                    extraContent &&
                    <span className="table-component-extracontent">{extraContent}</span>
                }
            </td>
        </>
    );
}

/**
 * Table component properties
 * 
 * items - List of items in table, 1 item per row
 * title - Table title 
 */
interface TableProps {
    items: TableItem[];
    title: string;
}
/**
 * Table item component properties
 * 
 * item - An item for table component
 */
interface TableItemProps {
    item: TableItem;
}
/**
 * Table item poperties
 * 
 * content - String based content that goes between <span> tags
 * href - URL to fetch extra content from
 */
type TableItem = {
    content: string | JSX.Element;
    href: string;
}
/**
 * Response extension to include possible extraContent
 * 
 * extraContent - Extra content from a response
 */
interface ExtraResponse extends Response {
    extraContent?: string;
}

export default TableComponent;
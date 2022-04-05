import React, { useMemo } from 'react';

import { Shimmer } from '../common/Shimmer';

import { ReactComponent as LeftIcon } from '../../assets/cheveron-left.svg';
import { ReactComponent as RightIcon } from '../../assets/cheveron-right.svg';

import './table.css';

const styles = {
  action: {
    width: '150px',
  }
}

const BUTTON_TYPE = {
  delete: { icon: 'delete_forever', color: 'red' },
  edit: { icon: 'edit', color: 'blue' },
  view: { icon: 'visibility', color: 'blue' },
}

const TableButton = ({ item, buttonType, onPress }) => {
  const href = typeof onPress === 'string' ? `${onPress}/${item.id}` : '#';

  function handleOnPres(event) {
    if (typeof onPress === 'function') {
      event.preventDefault();

      onPress(item);
    }
  }

  return (
    <div className="p-r-8">
      <a
        className={`btn ${buttonType.color} m-l-8`}
        href={href}
        onClick={handleOnPres}
      >
        <i className="material-icons">{buttonType.icon}</i>
      </a>
    </div>
  );
}

const TablePagination = ({ page = 1, itemPerPage = 10, onNext, onPrev }) => (
  <div className="table-pagination-div">
    <span>Elementos por página: {itemPerPage}</span>

    <button alt="Página anterior" onClick={onPrev}>
      <LeftIcon />
    </button>

    <span>Página: {page}</span>

    <button alt="Página siguiente" onClick={onNext}>
      <RightIcon />
    </button>
  </div>
);

const Table = ({
  isLoading = false,
  keys = [],
  onDeleteItem,
  onEditItem,
  onNextPage,
  onPrevPage,
  onViewItem,
  page,
  showPagination = false,
  values = [],
  itemPerPage,
}) => {

  const TableBody = () => (
    <>
      {
        values && values.map((item, index) => (
          <tr style={item.style} key={String(index)}>
            {keys.map((headerKey) => (
              <td className='p-h-8' key={headerKey.key}>
                {item[headerKey.key]}
              </td>
            ))}
            {(onViewItem || onEditItem || onDeleteItem) &&
              <td className="flex-row">
                {onViewItem && <TableButton
                  item={item}
                  onPress={onViewItem}
                  buttonType={BUTTON_TYPE.view}
                />}

                {onEditItem && <TableButton
                  item={item}
                  onPress={onEditItem}
                  buttonType={BUTTON_TYPE.edit}
                />
                }
                {onDeleteItem && <TableButton
                  item={item}
                  onPress={onDeleteItem}
                  buttonType={BUTTON_TYPE.delete}
                />}
              </td>}
          </tr>
        ))
      }
    </>
  );

  const TableBodyShimmer = () => (
    <>
      <tr>
        {keys.map((item, index) => (
          <td key={String(index)}><Shimmer height="40px" /></td>
        ))}
      </tr>

      <tr>
        {keys.map((item, index) => (
          <td key={String(index)}><Shimmer height="40px" /></td>
        ))}
      </tr>
    </>
  )

  return (
    <>
      <table className="responsive-table">
        <thead className="grey lighten-4">
          <tr className='table-head'>
            {keys.map((item, index) => (
              <td className={item.class} style={item.style} key={item.key || String(index)}>
                {item.value}
              </td>
            ))}

            {
              (onViewItem || onDeleteItem || onEditItem) && <td style={styles.action}>Acciones</td>
            }
          </tr>
        </thead>

        <tbody>
          {isLoading ? (<TableBodyShimmer />) : <TableBody />}
        </tbody>

      </table>

      {showPagination && (
        <TablePagination itemPerPage={itemPerPage} page={page} onNext={onNextPage} onPrev={onPrevPage} />
      )}
    </>
  );
};

export { Table, TablePagination }

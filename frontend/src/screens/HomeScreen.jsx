import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ButtonColored } from '../componets/buttons/ButtonColored';
import { InputFile } from '../componets/input/InputFile';
import { Table } from '../componets/tables';

import { useApiGet, useApiGoogle, useApiPost } from '../hooks';

const KEYS = [
  { key: 'user', value: 'Usuario' },
  { key: 'coment', value: 'Nombre' },
  { key: 'magnitude', value: 'Magnitud' },
  { class: '', style: { width: '90px' }, key: 'score', value: 'Score' },
];

const INITIAL_STATE = { values: [], name: '' };

function formatData(data) {
  return {
    ...data,
    magnitude: data.magnitude.toFixed(2),
    score: `${(data.score * 100).toFixed(2)} %`,
    style: { color: data.score < 0 ? '#ab000d' : '#00600f' }
  };
}

function formatDataList(dataList) {
  return dataList.map((data) => formatData(data));
}

const HomeScreen = () => {
  const [comentData, postComment] = useApiPost({ url: 'api/create' });
  const [comentDataAsync, postCommentAsync] = useApiPost({ url: 'api/craeteAsyn' });
  const [conmentGet, getComments, isCommentLoading] = useApiGet({ url: 'api/coments' });

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [comments, setComments] = useState(INITIAL_STATE);
  const [commentsAsync, setCommentsAsync] = useState(INITIAL_STATE);

  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingAsync, setLoadingAsyc] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);

  const inpDisabled = useMemo(() => (isLoading
    || isLoadingAsync
    || isCommentLoading)
    , [isCommentLoading, isLoading, isLoadingAsync])

  const resetTable = useCallback(() => {
    setDataTable([]);
    setLoading(true);
  }, []);

  const analyzeComments = useCallback(async (comments) => {
    const body = { contents: comments.values, fileName: comments.fileName };
    const response = await postComment({ body });

    if (response.isValid) {
      setDataTable(response.data.map((item) => ({
        ...item,
        magnitude: item.magnitude.toFixed(2),
        score: `${(item.score * 100).toFixed(2)} %`,
        style: { color: item.score < 0 ? '#ab000d' : '#00600f' }
      })));
    }

    setFileLoaded(true);
    setComments([])
    setLoading(false);
  }, []);

  const analyzeCommentsAsync = useCallback(async ({ items, fileName }) => {
    if (items.length === 0) {
      setLoading(false);
      setLoadingAsyc(false);
      setComments([]);

      return;
    };

    const [item, ...rest] = items;

    const response = await postCommentAsync({ body: { content: item, fileName } });

    if (response.isValid) {
      const { data } = response;
      setDataTable((prev) => ([
        ...prev,
        formatData(data),
      ]));
    } else {
      setLoading(false);
      setLoadingAsyc(false);
      setComments([]);

      return;
    }

    setFileLoaded(true);
    setLoading(false);
    analyzeCommentsAsync({ fileName, items: rest });
  }, []);

  const loadComments = useCallback(() => {
    const load = async () => {
      const result = await getComments({ params: { page, limit } });

      if (result.isValid) {
        setDataTable(formatDataList(result.data));
      }
    }

    setDataTable([]);
    load();
  }, [limit, page, getComments]);

  const onLoadMore = useCallback(() => {
    if (dataTable.length < limit) {
      return;
    }

    setPage((prev => prev + 1));
  }, [limit, page, dataTable]);

  const onLoadPrev = useCallback(() => {
    if (page <= 0) {
      return;
    }

    setPage((prev) => prev - 1);
  }, [limit, page]);


  const onReload = useCallback(() => {
    if (page === 0) {
      loadComments();
      setFileLoaded(false);
    }

    setPage(0)
  }, [page]);

  useEffect(() => {
    loadComments();
  }, [page]);

  useEffect(() => {
    if (comments.values.length === 0) return;

    resetTable();
    analyzeComments(comments);
  }, [analyzeComments, comments]);

  useEffect(() => {
    if (commentsAsync.values.length === 0) return;

    const { fileName, values } = commentsAsync;

    resetTable();
    setLoadingAsyc(true);
    analyzeCommentsAsync({ items: values, fileName });
  }, [analyzeCommentsAsync, commentsAsync]);

  return (
    <main className='container'>
      <div className='flex-col'>
        <div className="flex-row align-rigth">
          <ButtonColored
            onClick={onReload}
            disabled={inpDisabled}
            icon="history"
            className="mv-16 m-r-16"
            text="Recargar"
          />

          <InputFile
            className="align-rigth mv-16 m-r-16"
            disabled={inpDisabled}
            onChange={setComments}
            id="0"
          />
          <InputFile
            className="align-rigth mv-16"
            disabled={inpDisabled}
            onChange={setCommentsAsync}
            title='Cargar archivo async'
            id='1'
          />
        </div>

        <Table
          showPagination={!fileLoaded}
          keys={KEYS}
          isLoading={isLoading || isCommentLoading}
          values={dataTable}
          itemPerPage={limit}
          page={page + 1}
          onNextPage={onLoadMore}
          onPrevPage={onLoadPrev}
        />
      </div>
    </main>
  );
};

export { HomeScreen };

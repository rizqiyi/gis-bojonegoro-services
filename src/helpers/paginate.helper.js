const paginate = async ({ count, rows }, pageSize, pageLimit) => {
  try {
    const limit = parseInt(pageLimit, 10) || 10;
    const page = parseInt(pageSize, 10) || 1;

    let options = {
      offset: getOffset(page, limit),
      limit: limit,
    };

    return {
      previous_page: getPreviousPage(page),
      current_page: page,
      next_page: getNextPage(page, limit, count),
      total: count,
      per_page: limit,
      data: rows,
      offset: options.offset,
      limit: options.limit,
    };
  } catch (error) {
    console.log(error);
  }
};

const getOffset = (page, limit) => {
  return page * limit - limit;
};

const getNextPage = (page, limit, total) => {
  if (total / limit > page) {
    return page + 1;
  }

  return null;
};

const getPreviousPage = (page) => {
  if (page <= 1) {
    return null;
  }
  return page - 1;
};

export default paginate;

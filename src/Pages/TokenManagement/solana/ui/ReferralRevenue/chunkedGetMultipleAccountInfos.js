export function chunks(array, size) {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
}

export async function chunkedGetMultipleAccountInfos(
  connection,
  pks,
  chunkSize = 100
) {
  return (
    await Promise.all(
      chunks(pks, chunkSize).map((chunk) =>
        connection.getMultipleAccountsInfo(chunk)
      )
    )
  ).flat();
}

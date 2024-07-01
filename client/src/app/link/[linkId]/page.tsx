const Link = ({ params }: { params: { linkId: string } }) => {
  console.log(params);
  return <p>link {params.linkId}</p>;
};

export default Link;

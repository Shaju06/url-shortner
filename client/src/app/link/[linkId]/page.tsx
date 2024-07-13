import LinkDetails from "@/components/LinkDetails";

const Link = ({ params }: { params: { linkId: string } }) => {
  return <LinkDetails id={params.linkId} />;
};

export default Link;

import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import CreateNewLink from "./CreateNewLink";

const DashboardUI = () => {
  return (
    <div className="flex flex-col gap-4 mt-6 container">
      <div className="grid grid-cols-2 gap-4">
        <Card className="">
          <CardHeader>Links</CardHeader>
          <CardContent>0</CardContent>
        </Card>
        <Card>
          <CardHeader>Total links visited</CardHeader>
          <CardContent>0</CardContent>
        </Card>
      </div>
      <div className="flex justify-between mt-10">
        <h2>Links</h2>
        <CreateNewLink />
      </div>
      <div className="relative">
        <Input type="text" placeholder="Enter for search...." />
        <Filter className="absolute top-2 right-2 p-1 cursor-pointer" />
      </div>
    </div>
  );
};

export default DashboardUI;

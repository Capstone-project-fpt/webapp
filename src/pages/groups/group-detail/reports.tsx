import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const reports = [
    {
      id: 1,
      title: "Report 1",
      dueDate: "2023-10-01",
      status: "Completed",
    },
    {
      id: 2,
      title: "Report 2",
      dueDate: "2023-10-05",
      status: "Due",
    },
    // Add more reports as needed
  ];

  const categorizedReports = {
    Due: reports.filter((report) => report.status === "Due"),
    "Ready to Review": reports.filter(
      (report) => report.status === "Ready to Review"
    ),
    Reviewing: reports.filter((report) => report.status === "Reviewing"),
    Done: reports.filter((report) => report.status === "Completed"),
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(categorizedReports).map(([category, reports]) => (
          <div key={category}>
            <h2 className="text-xl font-bold mb-4">{category}</h2>
            {reports.map((report, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer"
                onClick={() => navigate(`./${report.id}`)}
              >
                <CardHeader>
                  <CardTitle>{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Due Date: {report.dueDate}</p>
                  <p>Status: {report.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Reports;

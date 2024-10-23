import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([
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
  ]);

  const handleDrop = (reportId: number, newStatus: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
  };

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
          <CategoryColumn
            key={category}
            category={category}
            reports={reports}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </>
  );
};

const CategoryColumn: React.FC<{
  category: string;
  reports: any[];
  onDrop: (reportId: number, newStatus: string) => void;
}> = ({ category, reports, onDrop }) => {
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = columnRef.current!;
    return dropTargetForElements({
      element,
      getData: () => ({ category }),
      onDrop: ({ source }) => {
        const reportId = source.data.reportId;
        onDrop(reportId, category);
      },
    });
  }, [category, onDrop]);

  return (
    <div ref={columnRef}>
      <h2 className="text-xl font-bold mb-4">{category}</h2>
      {reports.map((report, index) => (
        <DraggableReportCard key={index} report={report} />
      ))}
    </div>
  );
};

const DraggableReportCard: React.FC<{ report: any }> = ({ report }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = cardRef.current!;
    return draggable({
      element,
      getInitialData: () => ({ reportId: report.id }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [report.id]);

  return (
    <Card
      ref={cardRef}
      className={`p-4 cursor-pointer ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Due Date: {report.dueDate}</p>
        <p>Status: {report.status}</p>
      </CardContent>
    </Card>
  );
};

export default Reports;

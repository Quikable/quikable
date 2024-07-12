"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import axios from "axios";
import { toast } from "../ui/use-toast";
import { SingleDoc } from "@/models/Doc.model";

const AppLayouts = ({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) => {
  const [pdfView, setPdfView] = useState<SingleDoc | null>(null);
  const [docs, setDocs] = useState<SingleDoc[]>([]);

  const getDocs = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/docs/${params.id}`);

      if (!data.success) throw new Error("Error fetching document");

      setDocs(data.docs || "");
      setPdfView(data.docs[0]);
    } catch (error: any) {
      toast({ title: error.message });
    }
  }, [params.id]);

  useEffect(() => {
    getDocs();
  }, [getDocs]);

  // useEffect(() => {
  //   console.log("pv", pdfView);
  // }, [pdfView]);

  return (
    <div className="h-full w-full col-span-5">
      <div className="w-full h-[calc(100vh-4rem)] grid grid-cols-2">
        <div className="col-span-1">
          {pdfView && pdfView !== null && (
            <React.Fragment>
              <ScrollArea className="h-[3rem] w-full whitespace-nowrap flex items-center justify-center ">
                <div className="w-full space-x-4 h-full flex items-center mt-2 px-4">
                  {docs.map((item: any, idx: number) => (
                    <Badge
                      key={idx}
                      variant={item !== pdfView ? "outline" : "default"}
                      onClick={() => setPdfView(item)}
                      className="cursor-pointer"
                    >
                      {item.name}
                    </Badge>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <iframe
                src={`https://docs.google.com/gview?url=${pdfView.url}&embedded=true`}
                className="w-full h-[calc(100%-3rem)]"
              ></iframe>
            </React.Fragment>
          )}
        </div>

        <ScrollArea className="w-full h-full relative flex flex-col p-10">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AppLayouts;

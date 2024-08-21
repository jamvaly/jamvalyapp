import React, { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { auth, db } from "@/config/firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import { Pagination } from "@nextui-org/pagination";
import { Chip } from "@nextui-org/chip";
import { toast, Toaster } from "sonner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/table";
import { Button } from "@nextui-org/button";

interface Ticket {
  id: string;
  ticketId: string;
  roomTitle: string;
  roomPrice: string;
  createdAt: string;
  status: "active" | "allocated";
}

type ColumnKey = "roomDetails" | "status" | "actions";

const toasterStyles = {
  style: {
    zIndex: 10000 // A high value to ensure it's above other elements
  }
};

export default function OrderPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const rowsPerPage = 5;

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const ticketsRef = ref(db, `users/${user.uid}/tickets`);
      onValue(ticketsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ticketList: Ticket[] = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ticketId: value.ticketId,
            roomTitle: value.roomTitle,
            roomPrice: value.roomPrice,
            createdAt: new Date(value.createdAt).toLocaleDateString(),
            status: value.status || "active",
          }));
          setTickets(ticketList);
        } else {
          setTickets([]);
        }
        setIsLoading(false);
      });

      return () => {
        off(ticketsRef);
      };
    }
  }, []);

  const pages = Math.ceil(tickets.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return tickets.slice(start, end);
  }, [page, tickets]);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success("Ticket ID copied to clipboard!");
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success("Ticket ID copied to clipboard!");
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          toast.error("Failed to copy ticket ID. Please try again.");
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy ticket ID. Please try again.");
    }
  };

  const renderCell = (ticket: Ticket, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "roomDetails":
        return (
          <div className="flex flex-col">
            <p className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">{ticket.roomTitle}</p>
            <p className="text-xs text-gray-500">₦{ticket.roomPrice} | {ticket.createdAt}</p>
            <p className="text-xs text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">ID: {ticket.ticketId}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize text-xs"
            color={ticket.status === "active" ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {ticket.status}
          </Chip>
        );
      case "actions":
        return (
          <Button size="sm" className="text-xs" onClick={() => copyToClipboard(ticket.ticketId)}>
            Copy ID
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors closeButton {...toasterStyles} />
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center mt-5 justify-center">
            <h1 className={title()}>Your Orders</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table
              aria-label="Ticket orders table"
              bottomContent={
                tickets.length > 0 && (
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                )
              }
              bottomContentPlacement="outside"
              classNames={{
                wrapper: "max-w-full",
                th: "text-xs",
                td: "py-2",
              }}
            >
              <TableHeader>
                <TableColumn key="roomDetails">Room Details</TableColumn>
                <TableColumn key="status" className="w-20">Status</TableColumn>
                <TableColumn key="actions" className="w-20">Actions</TableColumn>
              </TableHeader>
              <TableBody 
                items={items}
                emptyContent={!isLoading && "No tickets found."}
              >
                {(item) => (
                  <TableRow key={item.id} className="border-b border-gray-200">
                    {(columnKey) => (
                      <TableCell>
                        {renderCell(item, columnKey as ColumnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </section>
      </DefaultLayout>
    </>
  );
}
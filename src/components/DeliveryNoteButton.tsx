"use client";

import useGeneratePdf from "@/hooks/generate-pdf";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function DeliveryNoteButton() {
  const { generatePdf, loading: generatePdfLoading } = useGeneratePdf();

  const handleDownloadDeliveryNote = () => {
    // Static data for the payload
    const payload = {
      mode: "DOWNLOAD",
      template_name: "delivery-note",
      payload: {
        purchase_order_id: "PO123456",
        delivery_order_id: "DO123456",
        sent_on: dayjs().format("DD MMMM YYYY"),
        warehouse_name: "Main Warehouse",
        warehouse_address: "123 Warehouse St, City, Country",
        supplier_name: "Supplier Inc.",
        supplier_phone: "+123456789",
        supplier_address: "456 Supplier Rd, City, Country",
        driver_name: "John Doe",
        driver_phone: "+987654321",
        vehicle_name: "Truck A",
        vehicle_plate: "ABC-123",
        order_items: [
          {
            product: "Product A",
            part: "Part 1",
            stage: "Stage 1",
            quantity: 10,
          },
        ],
        products: [
          {
            product_image_url: "https://example.com/image.jpg",
            product_name: "Product A",
            product_code: "PA123",
            product_wood_type: "Oak",
            product_color: "Brown",
            product_length: "2 m",
            product_width: "1 m",
            product_height: "0.5 m",
            product_size: "1 m³",
            product_nett_weight: "10 kg",
            product_gross_weight: "12 kg",
            product_knockdown_size: "0.5 m³",
          },
        ],
        remarks: "No remarks.",
      },
    };

    generatePdf({
      payload: payload,
      fileName: `Tarita Delivery Note - ${dayjs().format("DD MMMM YYYY")}`,
    });
  };

  return (
    <Button
      size="large"
      type="primary"
      icon={<DownloadOutlined />}
      loading={generatePdfLoading}
      onClick={handleDownloadDeliveryNote}
    >
      {generatePdfLoading ? "Downloading" : "Delivery Note"}
    </Button>
  );
}

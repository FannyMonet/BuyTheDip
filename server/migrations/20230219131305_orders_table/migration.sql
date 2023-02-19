-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

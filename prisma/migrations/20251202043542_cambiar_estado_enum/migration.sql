/*
  Warnings:

  - Made the column `estado_trabajo` on table `asignaciones` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `asignaciones` MODIFY `estado_trabajo` ENUM('Pendiente', 'Terminado', 'Cancelado') NOT NULL DEFAULT 'Pendiente';

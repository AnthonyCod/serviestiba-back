-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_rol` INTEGER NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `avatar_url` VARCHAR(255) NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_usuario` INTEGER NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `dni` VARCHAR(20) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `fecha_nacimiento` DATE NULL,
    `distrito` VARCHAR(100) NULL,
    `capacidad` ENUM('Nestle', 'Molitalia', 'Ambos') NULL,
    `imo` BOOLEAN NOT NULL DEFAULT false,
    `activo_empresa` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `personas_fk_usuario_key`(`fk_usuario`),
    UNIQUE INDEX `personas_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `razon_social` VARCHAR(150) NOT NULL,
    `ruc` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sedes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `nombre_sede` VARCHAR(100) NOT NULL,
    `direccion` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requerimientos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sede_id` INTEGER NOT NULL,
    `hora_inicio` TIME NOT NULL,
    `hora_fin` TIME NOT NULL,
    `fecha_servicio` DATE NOT NULL,
    `cantidad_personal` INTEGER NOT NULL,
    `herramienta` TEXT NULL,
    `viatico` DECIMAL(10, 2) NULL,
    `adicional` DECIMAL(10, 2) NULL,
    `extra_info` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asignaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requerimiento_id` INTEGER NOT NULL,
    `estado_trabajo` VARCHAR(50) NULL DEFAULT 'Pendiente',
    `pdf_url` VARCHAR(255) NULL,
    `extra_info` TEXT NULL,
    `fecha_creacion` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalles_asignacion` (
    `asignacion_id` INTEGER NOT NULL,
    `persona_id` INTEGER NOT NULL,
    `asistencia` ENUM('Pendiente', 'Si', 'No', 'Tardanza') NOT NULL DEFAULT 'Pendiente',

    PRIMARY KEY (`asignacion_id`, `persona_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_fk_rol_fkey` FOREIGN KEY (`fk_rol`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personas` ADD CONSTRAINT `personas_fk_usuario_fkey` FOREIGN KEY (`fk_usuario`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sedes` ADD CONSTRAINT `sedes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requerimientos` ADD CONSTRAINT `requerimientos_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sedes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_requerimiento_id_fkey` FOREIGN KEY (`requerimiento_id`) REFERENCES `requerimientos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalles_asignacion` ADD CONSTRAINT `detalles_asignacion_asignacion_id_fkey` FOREIGN KEY (`asignacion_id`) REFERENCES `asignaciones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalles_asignacion` ADD CONSTRAINT `detalles_asignacion_persona_id_fkey` FOREIGN KEY (`persona_id`) REFERENCES `personas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

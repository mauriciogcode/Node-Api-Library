-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-05-2021 a las 00:14:16
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 7.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `nombre` varchar(50) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`nombre`, `id`) VALUES
('AUTORES ARGENTINOS', 5),
('AUTORES ESPAÑOLES', 18),
('AUTORES USA', 29),
('BESTSELLERS', 4),
('CLASICOS DE LA LITERATURA', 13),
('INFANTIL', 3),
('NUEVA CATEGORIA', 16),
('ROMANCE', 32);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(60) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `persona_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id`, `nombre`, `descripcion`, `categoria_id`, `persona_id`) VALUES
(2, 'EL ALEPH', 'UN CLÁSCO DE JLB', 5, NULL),
(5, 'CENICIENTA', 'UN CUENTO DE HADAS.', 3, 7),
(6, 'BLANCA NIEVES Y LOS SIETE ENANITOS.', 'CUENTO CLÁSICO DE LOS HERMANOS GRIMM', 3, 7),
(7, 'EL GAUCHO MARTÍN FIERRO', 'CLÁSICO DE LA LITERATURA ARGENTINA', 5, NULL),
(8, 'LOS TRES PATITOS', 'SON TRES PATITO', 3, NULL),
(12, 'RAYUELA', 'UNA DE LAS NOVELAS MAS RECONOCIDAS DE JULIO CORTAZAR.', 5, NULL),
(15, 'EL TUNEL', 'LA NO MAS RECONOCIDA DEL AUTOR ERNESTO SABATO', 5, 39),
(29, 'LA ODISEA DE LOS GILES', 'ODISEAA', 4, NULL),
(30, 'LA BELLA Y LA BESTIA', 'CUENTOS PARA DORMIR', 3, 14),
(31, 'EL GATO CON BOTAS', 'UN CLASICO PARA NIÑOS', 3, NULL),
(32, 'VALIS', 'VALIS', 13, NULL),
(33, 'FIRULAIS', 'FIRULAIS ES UN PERRITO MUY SIMPÁTICO', 3, 48),
(35, 'JUANITO Y EL LOBO', 'JUANITO ES UN JOVEN MENTIROSO..', 3, NULL),
(36, 'LOS TRES CHANCHITOS', 'SE TRATA DE TRES CHANCHITOS', 3, NULL),
(37, 'EL GAUCHO ALAMBRE', 'SIN DESCRIPCIÓN', 5, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id` int(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `alias` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id`, `nombre`, `apellido`, `email`, `alias`) VALUES
(7, 'PEDRO', 'GARCIA', 'PEPITOG@GMAIL.COM', 'PEDROG'),
(14, 'ROBERTO', 'FERNADEZ', 'ELCHAVO@GMAIL.COM', 'ROBERTO'),
(30, 'CARLOS', 'ROTH', 'ROC@GMAIL.COM', 'CARLOSROTH'),
(34, 'FIORELA', 'BERTONE', 'FBERTONE@GMAIL.COM', 'FIORUCHIS'),
(36, 'REVERENDO', 'ALEGRIA', 'REVE@REVERENDO.COM.AR', 'REVERENDO'),
(39, 'ANDREA', 'FULANA', 'AFULANA@HOTMAIL.COM.AR', 'ANDREA F'),
(40, 'PEPITO', 'SUAREZ', 'PEPI@HOTMAIL.COM', 'PEPI'),
(48, 'JOSESITO', 'SUAREZ', 'JOSU@GMAIL.COM', 'JOSU');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `persona_id` (`persona_id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `libros_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

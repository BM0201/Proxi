# Dirección UI

La UI de Proxi debe ser clara, moderna, confiable y fácil de entender. El usuario debe saber qué hacer sin leer instrucciones largas: buscar, publicar, comparar, elegir proveedor y confirmar con pago protegido.

## Estilo visual aprobado

- Mobile-first.
- Fondos claros.
- Verde/teal como color principal.
- Cards redondeadas.
- Buscador grande.
- Categorías visuales.
- Badges para estado, nivel, reputación y verificación.
- Textos grandes, legibles y directos.

## Inspiración funcional

TaskRabbit sirve como referencia funcional para categorías claras, buscador y publicación de servicios. PedidosYa/Uber sirven como referencia funcional para flujo simple, ubicación y confirmación.

No se copian logos, assets, colores exactos ni composición visual de esas plataformas.

## Diferenciación Proxi

Proxi no vende empleo ni turnos. Conecta clientes con proveedores independientes verificados para resolver tareas puntuales.

Lenguaje correcto:

- Cliente.
- Proveedor independiente.
- Tarea.
- Oferta.
- Pago protegido.
- Zona aproximada.
- Dirección exacta protegida.
- Nivel.
- Estrellas.
- Reputación.
- Verificación.
- Comisión Proxi.
- Confirmar servicio.

Lenguaje a evitar:

- Empleado.
- Salario.
- Nómina.
- Jefe.
- Despido.
- Turno obligatorio.

## Componentes principales

Los componentes genéricos viven en `packages/ui`. Este sprint suma componentes visuales para el flujo inicial:

- `SearchHero`
- `CategoryCard`
- `StepFlow`
- `TaskCard`
- `OfferCard`
- `ProviderCard`
- `ProtectedPaymentSummary`
- `LocationPreview`

Los componentes específicos de cada app deben quedarse dentro de su frontend.

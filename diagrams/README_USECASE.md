This folder contains a PlantUML use-case diagram for the NodeShopRestAPI React app.

Files:

- usecase.puml — PlantUML source for the use case diagram.

Render locally (requirements: Java + PlantUML jar, or Docker):

Using plantuml.jar:

```pwsh
# from repository root
java -jar path\to\plantuml.jar -tsvg diagrams/usecase.puml
```

Using Docker (recommended when you don't want to install Java/PlantUML locally):

```pwsh
docker run --rm -v ${PWD}:/workspace plantuml/plantuml -tsvg /workspace/diagrams/usecase.puml
```

Or use an online PlantUML renderer by copying the contents of `usecase.puml`.

Notes:

- The diagram is a high-level mapping inferred from pages and Redux actions: Shop, Product Detail, Cart, Checkout (Stripe), Orders and Admin/ProductEditor.
- If you want changes (different actors, more details, or sequence/flow diagrams), tell me which areas to expand.

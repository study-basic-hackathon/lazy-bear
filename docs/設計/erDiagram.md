## ER図

```mermaid
erDiagram
    PROJECT ||--|{ STEP : have
    STEP ||--|{ TASK : breaks_into
    PERSONA ||--o{ PROJECT : uses
    PROJECT ||--o{ WEIGHT : targets
    PROJECT ||--|{ SCOPE : targets

    PROJECT {
        uuid projectId PK
        uuid personaId FK
        uuid weightId FK
        uuid scopeId FK
        varchar certificationName
        date examDate
        enum baseMaterial "TEXTBOOK / VIDEO"
    }

    STEP {
        uuid stepId PK
        uuid projectId FK
        varchar title
        text theme
        date startDate
        date endDate
        int index
    }

    TASK {
        uuid taskId PK
        uuid stepId FK
        varchar title
        text description
        date startDate
        date endDate
        enum taskStatus "undo|doing|done|blocked"
    }

    PERSONA {
        uuid personaId PK
        decimal weekdayHours
        decimal weekendHours
        enum learningPattern "インプット先行パターン|アウトプット先行パターン"
    }

    WEIGHT {
        uuid weightId PK
        uuid projectId FK
        varchar area
        int weightPercent
    }

    SCOPE {
        uuid scopeId PK
        uuid projectId FK
        varchar scope
        text description
    }
```
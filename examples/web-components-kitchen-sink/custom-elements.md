# demo-wc-card

This is a container looking like a card with a back and front side you can switch

## Properties

| Property   | Attribute   | Type      | Default        | Description                                  |
|------------|-------------|-----------|----------------|----------------------------------------------|
| `backSide` | `back-side` | `boolean` | false          | Indicates that the back of the card is shown |
| `header`   | `header`    | `string`  | "Your Message" | Header message                               |
| `rows`     | `rows`      | `object`  | []             | Data rows                                    |

## Methods

| Method   | Type       |
|----------|------------|
| `toggle` | `(): void` |

## Events

| Event          | Description                                   |
|----------------|-----------------------------------------------|
| `side-changed` | Fires whenever it switches between front/back |

## Slots

| Name | Description                                |
|------|--------------------------------------------|
|      | This is an unnamed slot (the default slot) |

## CSS Shadow Parts

| Part    | Description       |
|---------|-------------------|
| `back`  | Back of the card  |
| `front` | Front of the card |

## CSS Custom Properties

| Property                          | Description          |
|-----------------------------------|----------------------|
| `--demo-wc-card-back-color`       | Font color for back  |
| `--demo-wc-card-front-color`      | Font color for front |
| `--demo-wc-card-header-font-size` | Header font size     |

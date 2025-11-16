_choose:
    @just --choose

lint:
    @npx prettier src/ types/ test/ --write

test:
    @cd test && npm run test

#!/bin/bash

if (($# != 2)); then
    echo "Usage: ./create_tags.sh <version (for example 1.7.0)> <environment (for example testing, staging)>"
    exit 1
fi

environment=("testing" "staging" "prod")

if [[ ! " ${environment[@]} " =~ " $2 " ]]; then
    echo "Environment $2 is not supported. Supported environments are: ${environment[@]}"
    exit 1
fi

git fetch --prune --prune-tags --tags

tags=($(git tag))

suffix=""
pattern=""
if [[ "$2" = "testing" ]]; then
    suffix="TEST"
    pattern=".*$suffix.*"
elif [[ "$2" = "staging" ]]; then
    suffix="rc"
    pattern=".*$suffix.*"
elif [[ "$2" = "prod" ]]; then
    echo "Production release has to be created on Github here: https://github.com/JimberSoftware/pde-risk-analyzer/releases/new"
    exit 1
fi

current_number_for_type=0
for tag in "${tags[@]}"; do
    if [[ $tag =~ v$1-$t$pattern ]]; then
        last_two="${tag: -2}"
        if ((10#$last_two > 10#$current_number_for_type)); then
            current_number_for_type=$last_two
        fi
    fi
done
current_number_for_type=$((10#$current_number_for_type + 1))
if ((current_number_for_type < 10)); then
    current_number_for_type="0$current_number_for_type"
fi

echo "Creating tag v$1-$suffix$current_number_for_type"
git tag v$1-$t$suffix$current_number_for_type
git push origin v$1-$t$suffix$current_number_for_type

package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"log"
	"math/rand"
	"os/exec"
	"strconv"
	"strings"

	_ "net/http"
)

type Status struct {
	Status string `json:"status"`
	It string `json:"it"`
}

type Puzzle struct {
	Width int64 `json:"width"`
	Height int64 `json:"height"`
	Difficulty string `json:"difficulty"`
	Problem string `json:"problem"`
	Solution string `json:"solution"`
	Have string `json:"have"`
}

func main() {
	m := martini.Classic()
	m.Use(render.Renderer(render.Options{
		Charset: "UTF-8",
	}))

	m.Get("/", func() string {
		return "Hello world!"
	})
	m.Get("/status", func(r render.Render) {

		status := Status{
			Status: "running",
			It: "ok",
		}

		r.JSON(200, status)
	})
	m.Get("/puzzle", func(r render.Render, m martini.Params){

		width, widthFound := m["width"]
		if !widthFound {
			width = "12"
		}
		height, heightFound := m["height"]
		if !heightFound {
			height = "12"
		}
		difficulty, difficultyFound := m["difficulty"]
		if !difficultyFound {
			difficulty = "HARD"
		}
		seed, seedFound := m["seed"]
		if !seedFound {
			seed = strconv.FormatInt(rand.Int63(),10)
		}

		widthInt, err := strconv.Atoi(width)
		if err != nil {
			log.Println(err)
			r.JSON(502, "error")
			return
		}

		heightInt, err := strconv.Atoi(height)
		if err != nil {
			log.Println(err)
			r.JSON(502, "error")
			return
		}

		puzzle, err := generatePuzzle(widthInt, heightInt, difficulty, seed)

		if err != nil {
			log.Println(err)
			r.JSON(502, "error")
			return
		}

		r.JSON(200, puzzle)
	})

	puzzle, err := generatePuzzle(12, 5, "HARD", "toto")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(puzzle)

	m.RunOnAddr(":5002")
}

func generatePuzzle(width int, height int, difficulty string, seed string) (Puzzle, error) {

	difficultyLetter := "e" // EASY
	switch difficulty {
	case "EASY":
		difficultyLetter = "e"
	case "HARD":
		difficultyLetter = "h"
	default:
		difficultyLetter = "e"
	}

	sizeParam := fmt.Sprintf("%sx%sd%s", width, height, difficultyLetter)

	cmd := exec.Command("slant_puzzle", sizeParam, seed)

	commandOutput, err := cmd.CombinedOutput()

	if err != nil {
		return Puzzle{}, err
	}

	output := string(commandOutput)
	//In the results there is \\ characters that doesn't get encoded.
	outputEscaped := strings.ReplaceAll(output, "\\", ".")

	var puzzle Puzzle

	json.Unmarshal([]byte(outputEscaped), &puzzle)

	puzzle.Solution = strings.ReplaceAll(puzzle.Solution, ".", "\\")

	return puzzle, nil
}



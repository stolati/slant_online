package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"log"
	"math/rand"
	"net/http"
	"os"
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
	m.Get("/puzzle", func(render render.Render, request *http.Request){

		qs := request.URL.Query()

		width := qs.Get("width")
		if width == "" {
			width = "12"
		}
		widthInt, err := strconv.Atoi(width)
		if err != nil {
			log.Println(err)
			render.JSON(502, "error")
			return
		}

		height := qs.Get("height")
		if height == "" {
			height = "12"
		}
		heightInt, err := strconv.Atoi(height)
		if err != nil {
			log.Println(err)
			render.JSON(502, "error")
			return
		}

		difficulty := qs.Get("difficulty")
		if difficulty == "" {
			difficulty = "HARD"
		}
		seed := qs.Get("seed")
		if seed == "" {
			seed = strconv.FormatInt(rand.Int63(),10)
		}


		puzzle, err := generatePuzzle(widthInt, heightInt, difficulty, seed)

		if err != nil {
			log.Println(err)
			render.JSON(502, "error")
			return
		}

		render.JSON(200, puzzle)
	})

	//Check that we have access to the binary to generate puzzles
	puzzle, err := generatePuzzle(12, 5, "HARD", "toto")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(puzzle)

	_, found := os.LookupEnv("PUZZLE_SERVICE_CHECK_ONLY")

	if found {
		//Doesn't start the server
		return
	}

	runOnAddr := os.Getenv("RUN_ON_ADDR")
	log.Println("Starting on : ", runOnAddr)

	m.RunOnAddr(runOnAddr)
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

	sizeParam := fmt.Sprintf("%dx%dd%s", width, height, difficultyLetter)

	fmt.Println("Generating puzzle", sizeParam, seed)
	cmd := exec.Command("slant_puzzle", sizeParam, seed)

	commandOutput, err := cmd.CombinedOutput()

	//fmt.Println(string(commandOutput))

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



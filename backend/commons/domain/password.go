package domain

import (
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"github.com/xdg-go/pbkdf2"
)

const saltLen = 16

var NoPassword = Password{
	Salt: make([]byte, 0),
	Hash: make([]byte, 0),
}

type Password struct {
	Salt []byte `json:"Salt,omitempty"`
	Hash []byte `json:"hash,omitempty"`
}

func NewPassword(pswd string) Password {
	salt := make([]byte, saltLen)

	_, err := rand.Read(salt)

	if err != nil {
		fmt.Println(err.Error())
	}

	hash := pbkdf2.Key([]byte(pswd), salt, 10000, 64, sha256.New)

	return Password{
		Salt: salt,
		Hash: hash,
	}
}

func (p Password) Equals(pswd string) bool {
	otherHash := pbkdf2.Key([]byte(pswd), p.Salt, 10000, 64, sha256.New)

	return string(otherHash) == string(p.Hash)
}

func (p Password) IsNoPassword() bool {
	return len(p.Hash) == 0 && len(p.Salt) == 0
}

---
title: "ranif: Lie Group Library for Robotics"
date: 2026-05-22
categories: ["robos"]
tags: ["robot", "manifold", "slam"]
draft: false
---

*Design notes for [ranif](https://codeberg.org/sreeharshacs/ranif), a from-scratch Rust Lie-group / factor-graph library. Source: [`docs/index.qmd`](https://codeberg.org/sreeharshacs/ranif/src/branch/master/docs/index.qmd).*

## Yet another document

I know, there have been a lot of documents specifically associated with
just the Lie groups and the associated math required to do state
estimation in robotics. But I feel nothing has been unnecessary and all
the docs serve a specific purpose. In lieu of that this one is my
internal walk through of how I went about doing this library. There are
already enough details in the [design doc](https://codeberg.org/sreeharshacs/ranif/src/branch/master/DESIGN_DOC.md) regarding
the structure of the library. Here I will go into even more details of
the code itself that would be of interest and how it would relate to the
actually math and functions in Sola et. al. Along with that I might have
my own rumblings about rust and its quirkiness
<span style="color:#888">I guess those are not quirks if
you were the generation to grow up with rust</span>.


## Morphism

The first thing in implementing this library is to find a way to write
code to explain a particular group which satisfy a set of axioms which
is generic and then additional code that adds specifics for each
different embodiment of the group. So we head into the land of
polymorphism and as rust calls templates monomorphism. The first thing
in any of these is how, be it static or dynamic, the language
handles/calls a specific instance of the generic.

There are different ways in which dispatch of generics is achieved in
rust unlike any other language
<span style="color:#888">when I say any other, I mean c++
</span>. As a one word explaination to how any *morphism* is implemented
it is **traits**. I think based on my limited exposure to rust traits is
the most used and powerful concept. This is like the abstract classes in
C++ albeit without all the problems that comes with inheritance. Or more
precisely a tool for *poly*-morphism without the hassle of templates and
without the inefficiencies of inheritance. The concept is just it
provides a set of traits anything that is downstream of it has to
implement. This ties in the “derived” implementations to the abstract
“base class”. This is more the static polymorphism which I found super
useful for representing [Lie groups](#traits-of-lie-groups). This is
then extended to second concept involving `enum` - `match` constructs
which I have used mostly for the [variable
nodes](#enum-math-variable-nodes) in factor graph. The third one is dyn
trait objects that is runtime polymorphism which was pretty well suited
for [factor nodes](#dyn-factor-nodes).

## Traits of Lie Groups

In the context of this project I have defined a `LieGroup` which is a
custom trait that I have added which specifies what a Lie group is about
and the different operations it has to provide being a Lie group. `Rn`,
`SO2`, `SO3`, `SE2`, `SE3` are the different implementations of the Lie
group. Also I have added two built in traits from the `aprox` crate for
each of the Lie group.

These are the traits each of the groups implement: - `LieGroup`: All
groups including `Rn` implements this - `Jacobian`: The left, right and
the coresponding inverse jacobians. `Rn` does not implement this. -
`Action`: The group actions. I thought I could add a blanket impl of
`Mul` so that the `*` operator calls the `act` function for all the
groups since that is what it actually does. It looks like it is not
allowed to have an external trait be implemented for a generic type
since the compiler wouldnt know how to generate it. Check [orphan
rules](https://doc.rust-lang.org/reference/items/implementations.html#r-items.impl.trait.orphan-rule)

Everything downstream of `LieGroup`, `Jacobian` and `Action` is now a
specific implementation of each of the traits. Even further downstream,
they are referred by saying this chunk of code is applicable to anything
that implements <span style="color:#888"> has </span> this
trait. This is the classic case of composition. The compiler generates
code for each of the type that is applicable.

## Proptest

Following the initial traits addition and “the” derived implementaion of
the traits for `Rn` Lie group, `proptest` is one of the major concepts
in rust thats super handy. As the name indicates it is something to do
with tests. This crate(?) provides a way to automate the providing a
wide range of inputs to the test and that test evaluates whatever it
needs to evaluates. As opposed to unit test where we would generally
provide a specific input and test the code against that specific input,
here we provide an rich automated solution o provide varid kinds of
inputs. Again as I stated earlier I won’t go into the mechanics of the
rust language but just note down some thoughts while going through it.

In the [compound strategies
page](https://proptest-rs.github.io/proptest/proptest/tutorial/compound-strategies.html)
they mention that to provide multiple inputs the simplest would be a
tuple and the exact sentence is **a tuple of strategies is itself a
strategy for tuples of the values those strategies produce**, which I
have no idea what it means. But my takeaway for this section is that
while providing an input to the `TestRunner` we just provide a tuple of
streategies matching the inputs.

##### *SideNote*

*Since `proptest` is a trait and there are many different
implementations of this trait to satisfy different strategies, there is
a `BoxedStrategy` which provides something similar to type
erasure<span style="color:#888"> The document specifically
does not mention type erasure but thats what I surmized based on what it
does</span>. It converts both the strategy and the values into a trait
objects <span style="color:#888">which we came across as
abstract types specified inside the trait definition</span> that allow
for various different types of strategies and values to be passed
around.*

One super important feature of `proptest` is shrinking. There is a
simplify and complicate method for the value tree that can be used to do
a binary search on the values that are generated. `proptest` automates
this by finding the simplest value that fails. This is known as
**shrinking** <span style="color:#888">and its cool</span>

### Test group axioms

As mentioned earlier `proptest` is excellent in testing something in
bulk and the inputs for the functions are arbitrary.

## macro_rules

Another important and pretty neet feature of rust is `macro_rules`. This
is a declarative macro which provides a way to parse the code and
provide an
addition/substitution/replacement<span style="color:#888">
which rarely happens</span> to the code and spit it out. This is exactly
as the declaritives in python and functionally similar to templates in
c++ although not as descriptive. The rust book
[page](https://doc.rust-lang.org/book/ch20-05-macros.html) is quite
dense but found [this
reference](https://lukaswirth.dev/tlborm/introduction.html) to be quite
useful. Conceptually macros in C/C++ is different than what it is in
rust, and derivatively it is different in terms where the macros are
processed by the compiler which is after tokenization and
parsing(generates something called `A`bstract `S`yntax `T`ree).
<span style="color:#888">Its a nice reference to go
through</span>

This provides a way to specify the axioms that the Lie groups have to
satisfy to be called a [Lie
group](#traits-of-lie-groups). Any new group would just
have to provide two methods `arb_group` and `arb_tangent` that provide a
`Strategy Value Type` that can be used to test the group.

## Const generics

Well the title is the end goal of what I want but let me start from the
beginning. For a composite manifold if I were to do this whole library
in c++ I would have gone with fold expressions or variadic templates
<span style="color:#888">maybe not varidics to make life
easier and use fold </span>. This would have allowed for packing the
tangent space size and allow for nice mapping of each manifold blocks
into the Eigen vectors and matrices.

```cpp
//| eval: false
template <typename... Gs>
  struct Composite {
      std::tuple<Gs...> comps;
      static constexpr std::size_t DOF = (Gs::DOF + ... + 0);   // C++17 fold over the pack
      using Tangent = Eigen::Matrix<double, DOF, 1>;            // NTTP computed from the pack


      template <std::size_t... I>
      Composite compose_impl(const Composite& o, std::index_sequence<I...>) const {
          return { { std::get<I>(comps).compose(std::get<I>(o.comps))... } };  // pack expansion = "for each component"
      }
      Composite compose(const Composite& o) const {
          return compose_impl(o, std::index_sequence_for<Gs...>{});
      }
  };
```

I learnt the hard way that there is no option for that in
rust<span style="color:#888"> not the fold expressions
which can be done using macro rules but NTTP to define the size of the
type from generic parameters</span>. There is a section called [const
generics](https://doc.rust-lang.org/reference/items/generics.html#const-generics)
which prohibits this. The macros is declared legal only if the consts
can be inferred from concrete types.

To enable the generic variadics similar to c++ rust needs a super manual
step of writing a macro_rule which expands arbitraty types and combines
them to a composite type. Since there are no generic consts type one
additional convoluted step needs to be added :
[composites](https://codeberg.org/sreeharshacs/ranif/src/branch/master/src/core/composite.rs)

## `enum`-`match` Variable Nodes

As I mentioned there is a kind of inheritence where dyn-compatible
traits provides(the c++ type of inheritence), allows for easier
extensibility. But I would rather have everything listed at the root
rather than dynamic polymorphism where one has to wade through to find
what a particular functionality leads to. This is the essence of using
`enum` and `match`. Enums are not the typical enums we find in C++ but
an enhanced version of it. We can have different typed entries in an
enum and `match` allows to explicitly redirect to different methods
based on those types and what we would want to do with them. Its like
the `std::variant` and `std::visit` rolled into one. I thought I would
have the factor graph designed in this way where I would have variable
nodes defined as an enum that provides possible Lie Group variants and
factor nodes as another enum. The match clause would not be very
difficult either since each of these are defined common traits that
provide a particular trait that the optimizer would eventually use. But
this would mean that I would have to update this portion of the code
everytime I add a new Lie Group or a factor. Decision, decisions. I
ended up using this for variable nodes since I have the pain point of
[const generics](#const-generics) to extract the `DOF` of each node and
bypass the `vtable` cast/coercion.

## `dyn` Factor Nodes

The most common of the object oriented programming, the virtual
functions is implemented in rust as a `dyn` trait object that is
resolved in runtime and this is the common `ptr` and `vtable` using
dynamic dispatch. Coming from C++, runtime poolymorphism is based on the
base class and inherited class. Dynamic dispatch involves a `vtable` of
each of the classes that has the function pointers of all the virtual
and overridden functions. The `vptr` then points to the current vtable
based on the type. Now onto rust, there is no inheritence per se. But it
does have dynamic dispatch based on `dyn` trait objects. These have a
pointer to the actual data and the vtable for each of the functions in
the trait the type of data defines.

Since factor nodes vary in arity but there are no consts which are
specifically required by the user (in this case the optimizer) for any
computation and everything is abstracted inside the linearize and
whitened cost function `dyn` trait objects are perfectly suitable here.
This allows for erased factors and the internal linearization items to
be handled without again having to specify a bunch of rules. For me I
feel like using `dyn` trait objects wherever erasure is required similar
to in C++.

## Intersting Reads

I made this section just for pointing out some useful resources that I
combed over to understand what exactly is happening under the hood in
rust:

### Dynamic dispatch

- [Huon Wilson - “Peeking Inside Trait
  Objects”](https://huonw.github.io/blog/2015/01/peeking-inside-trait-objects/)
  Definitive guide to trait objects. Provides the initial introduction
  to how trait objects are represented in rust and how dyn dispatch is
  done using vptr and vtable.
- [ALSchwalm — “Exploring Dynamic Dispatch in
  Rust”](https://alschwalm.com/blog/static/2017/03/07/exploring-dynamic-dispatch-in-rust/):
  goes to the assembly level and explicitly contrasts Rust’s fat-pointer
  layout with C++’s embedded-vptr layout, including the “you don’t pay
  the vptr cost unless used polymorphically” trade-off. Was easy to
  relate to coming from C++.
- [Jon Gjengset — “Crust of Rust: Dispatch and Fat
  Pointers”](https://www.youtube.com/watch?v=xcygqF5LVmM) This was the
  most useful resource in understanding how morphism works in rust.
  Albeit it is two hours long.

### Macros

- [“Macros by Example: A Methodical
  Introduction”](https://veykril.github.io/tlborm/decl-macros/macros-methodical.html)
  Pretty complete coverage that provides a good understanding of how
  macros can be built from metavariables -\> fragment specifiers -\>
  repititions.

## Test structure

All the integration tests are added in @tests directory. The packaging
in rust seems like it never allows for a diamond dependancy inherently
by not allowing to depend on anything outside of `src` for a partcular
crate. The unit tests are supposed to be added inside each file of its
own and only the integration tests in the tests directory. For example I
have added a helper function `numerical_jacobian` to test the jacobians.
I was planning to include this inside the Rn implementation file, but
that is not alowed since tests can import src but not the other way
round. So its been added in the @tests/common.

### \[cfg(…)\]

This macro <span style="color:#888">The doc says
attribute, but thats ust another type of macro specification</span> is
like the compiler `ifdef` flags of c++. Unit tests are added within the
same file as the code it is being tested and the macro `#[cfg(test)]` is
used to demarcate the test code whih is compiled ony when `cargo test`
is run.


## Appendix

- Fragment specifiers (what ident/ty/expr/tt/… each match):
  https://veykril.github.io/tlborm/decl-macros/minutiae/fragment-specifiers.html
- Rust Reference — Macros By Example (the precise spec for repetition
  operators, separators, and \$crate/hygiene):
  https://doc.rust-lang.org/reference/macros-by-example.html
- [Rust philosophy
  blog](https://www.thecodedmessage.com/posts/pl-features/)
- pub(crate): Things defined by this are only public to the current
  crate
- [closures](https://doc.rust-lang.org/book/ch13-01-closures.html): This
  is pretty much lambdas in c++. I do like the syntax better in c++ but
  there are some interesting features like the FnOnce, FnMut, on top of
  the basic lambda.

### Observations

#### Crust of Rust

1.  Templates in client code is something not heard of, we define
    everything in the header file. But rust allows for the client code
    to define the templates actually **traits**.
2.  The other way round where we would need dynamic linking of generics,
    thats not done in rust. This is pretty good in the sense that you
    are inherently restricting something which is not a certifiable code
    and thats a good thing.
3.  `dyn` is a fat pointer containing two pointers one to the data and
    one to the vtable
4.  Can make a trait not object safe by adding `where Self: Sized` that
    makes that particular methods ignore being added into vtable. But it
    is super wierd and havent found any usecase
5.  mentions garbage collection!!\<\>

